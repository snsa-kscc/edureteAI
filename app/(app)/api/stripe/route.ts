import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateSubscriptionInDatabase, getUserIdFromCustomer } from "@/lib/subscription-actions";
import { updateUserSubscriptionTier, resetUserMessageCounts } from "@/lib/message-limits";
import { MESSAGE_TIER } from "@/lib/model-config";
import { sendSubscriptionWelcomeEmail, sendUpgradeEmail } from "@/lib/mail-config";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("No Stripe signature found", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error(error instanceof Error ? `Webhook Error: ${error.message}` : `Webhook Error`);
    return new NextResponse(error instanceof Error ? `Webhook Error: ${error.message}` : "Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = session as Stripe.Checkout.Session;

        if (checkoutSession.mode === "subscription" && checkoutSession.customer && checkoutSession.subscription) {
          const userId = checkoutSession.metadata?.userId;
          const planType = checkoutSession.metadata?.plan;

          if (!userId) {
            console.error("No userId found in checkout session metadata");
            return new NextResponse("No userId found in checkout session metadata", { status: 400 });
          }

          const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string);
          const priceId = subscription.items.data[0].price.id;
          const tier = planType === MESSAGE_TIER.PAID_PLUS ? MESSAGE_TIER.PAID_PLUS : MESSAGE_TIER.PAID;

          await updateSubscriptionInDatabase(
            userId,
            checkoutSession.customer as string,
            subscription.id,
            priceId,
            tier,
            subscription.status,
            new Date(subscription.items.data[0].current_period_end * 1000)
          );
          await updateUserSubscriptionTier(userId, tier);
          await resetUserMessageCounts(userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = session as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(subscription.customer as string);

        if (!userId) {
          console.error("No userId found for customer", subscription.customer);
          return new NextResponse("No userId found for customer", { status: 400 });
        }

        const priceId = subscription.items.data[0].price.id;
        let tier = MESSAGE_TIER.PAID;

        if (priceId === process.env.STRIPE_PRICE_ID_PAID_PLUS) {
          tier = MESSAGE_TIER.PAID_PLUS;
        }

        const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;

        let pendingTier = null;

        if (cancelAtPeriodEnd) {
          pendingTier = MESSAGE_TIER.FREE;
        }

        // Access the full event data to get previous_attributes
        const previousAttributes = (event.data as any).previous_attributes;
        if (previousAttributes && previousAttributes.items && previousAttributes.items.data) {
          const previousPriceId = previousAttributes.items.data[0].price.id;
          // Detect upgrade from PAID to PAID_PLUS
          if (previousPriceId === process.env.STRIPE_PRICE_ID_PAID && priceId === process.env.STRIPE_PRICE_ID_PAID_PLUS) {
            await sendUpgradeEmail(userId);
          }
        }

        await updateSubscriptionInDatabase(
          userId,
          subscription.customer as string,
          subscription.id,
          priceId,
          tier,
          subscription.status,
          new Date(subscription.items.data[0].current_period_end * 1000),
          cancelAtPeriodEnd,
          pendingTier
        );
        break;
      }

      case "customer.subscription.created": {
        const subscription = session as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(subscription.customer as string);

        if (!userId) {
          console.error("No userId found for customer", subscription.customer);
          return new NextResponse("No userId found for customer", { status: 400 });
        }

        const priceId = subscription.items.data[0].price.id;
        let tier = MESSAGE_TIER.PAID;

        if (priceId === process.env.STRIPE_PRICE_ID_PAID_PLUS) {
          tier = MESSAGE_TIER.PAID_PLUS;
        }
        await sendSubscriptionWelcomeEmail(userId, tier);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = session as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(subscription.customer as string);

        if (!userId) {
          console.error("No userId found for customer", subscription.customer);
          return new NextResponse("No userId found for customer", { status: 400 });
        }

        const priceId = subscription.items.data[0].price.id;

        await updateSubscriptionInDatabase(
          userId,
          subscription.customer as string,
          subscription.id,
          priceId,
          MESSAGE_TIER.FREE,
          "canceled",
          new Date(subscription.items.data[0].current_period_end * 1000),
          false, // cancelAtPeriodEnd = false (subscription is completely ended, not pending cancellation)
          null // pendingTier = null (no pending changes, subscription is fully terminated)
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
