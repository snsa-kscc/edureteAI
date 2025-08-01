"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions, message_counts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserSubscription } from "@/lib/subscription-utils";
import { updateUserSubscriptionTier } from "./message-limits";
import { MESSAGE_TIER, MESSAGE_LIMITS, SUBSCRIPTION_PLANS } from "@/lib/model-config";
import type Stripe from "stripe";

type CheckoutPlan = keyof typeof SUBSCRIPTION_PLANS;

// Type definition for subscription details with the new fields
export interface UserSubscriptionDetails {
  isSubscribed: boolean;
  tier: string;
  plan: CheckoutPlan | null;
  totalMessages: number;
  premiumModelMessages: number;
  periodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  pendingTier: string | null;
}

/**
 * Create a checkout session for a subscription plan
 * @param plan The subscription plan to checkout
 * @param returnUrl The URL to return to after checkout
 * @returns The checkout URL
 */
export async function createCheckoutSession(plan: CheckoutPlan, returnUrl: string) {
  try {
    const { sessionClaims } = await auth();
    const user = await currentUser();
    const userId = sessionClaims?.userId;

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    // Get the price ID based on the plan
    const priceId = SUBSCRIPTION_PLANS[plan].priceId;

    if (!priceId) {
      throw new Error(`No price ID found for plan: ${plan}`);
    }

    // Check if the user already has a customer ID in Stripe
    const userSubscription = await getUserSubscription(userId);
    let customerId = userSubscription?.stripeCustomerId;

    // If no customer ID exists, create a new customer in Stripe
    if (!customerId) {
      const email = user?.emailAddresses[0].emailAddress;
      const firstName = user?.firstName;
      const lastName = user?.lastName;

      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email,
        name: `${firstName || ""} ${lastName || ""}`.trim() || undefined,
        metadata: {
          userId,
        },
      });

      customerId = customer.id;
    }

    // Create a new checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}/success`,
      cancel_url: `${returnUrl}/`,
      metadata: {
        userId,
        plan,
      },
    });

    // If no checkout URL is returned, throw an error
    if (!checkoutSession.url) {
      throw new Error("Failed to create checkout session");
    }

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Create a Stripe portal session for managing a subscription
 * @param returnUrl The URL to return to after using the portal
 * @returns The portal URL
 */
export async function createPortalSession(returnUrl: string) {
  try {
    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId;

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const userSubscription = await getUserSubscription(userId);

    if (!userSubscription?.stripeCustomerId) {
      throw new Error("No Stripe customer ID found for user");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}

/**
 * Get the current user's subscription status and details
 * @returns Object with subscription details
 */
export async function getUserSubscriptionDetails(): Promise<UserSubscriptionDetails> {
  try {
    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId;

    if (!userId) {
      return {
        isSubscribed: false,
        tier: MESSAGE_TIER.FREE,
        plan: null,
        totalMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].TOTAL_MESSAGES,
        premiumModelMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].PREMIUM_MODEL_MESSAGES,
        cancelAtPeriodEnd: false,
        pendingTier: null,
      };
    }

    const subscription = await getUserSubscription(userId);

    // Check if subscription is active
    const isActive =
      subscription?.status === "active" &&
      subscription?.tier !== MESSAGE_TIER.FREE &&
      subscription?.stripeCurrentPeriodEnd &&
      new Date(subscription.stripeCurrentPeriodEnd) > new Date();

    // If not active, return free tier details
    if (!isActive) {
      return {
        isSubscribed: false,
        tier: MESSAGE_TIER.FREE,
        plan: null,
        totalMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].TOTAL_MESSAGES,
        premiumModelMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].PREMIUM_MODEL_MESSAGES,
        cancelAtPeriodEnd: false,
        pendingTier: null,
      };
    }

    // Get the tier name from the subscription
    const tierName = subscription.tier as keyof typeof MESSAGE_TIER;

    // Find the corresponding plan key by matching the tier
    const planKey = Object.keys(SUBSCRIPTION_PLANS).find((key) => SUBSCRIPTION_PLANS[key as CheckoutPlan].tier === subscription.tier) as
      | CheckoutPlan
      | undefined;

    // Get the limits for this tier
    const limits = MESSAGE_LIMITS[tierName] || MESSAGE_LIMITS[MESSAGE_TIER.FREE];

    // Get information about pending changes (cancellation or tier change)
    const isPendingCancellation = subscription.cancelAtPeriodEnd || false;
    const pendingTier = subscription.pendingTier || null;

    return {
      isSubscribed: true,
      tier: subscription.tier,
      plan: planKey || null,
      totalMessages: limits.TOTAL_MESSAGES,
      premiumModelMessages: limits.PREMIUM_MODEL_MESSAGES,
      periodEnd: subscription.stripeCurrentPeriodEnd,
      cancelAtPeriodEnd: isPendingCancellation,
      pendingTier: pendingTier,
    };
  } catch (error) {
    console.error("Error getting user subscription details:", error);
    return {
      isSubscribed: false,
      tier: MESSAGE_TIER.FREE,
      plan: null,
      totalMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].TOTAL_MESSAGES,
      premiumModelMessages: MESSAGE_LIMITS[MESSAGE_TIER.FREE].PREMIUM_MODEL_MESSAGES,
      cancelAtPeriodEnd: false,
      pendingTier: null,
    };
  }
}

/**
 * Update the subscription in the database.
 * This function is used by the webhook handler
 */
export async function updateSubscriptionInDatabase(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  tier: string,
  status: string,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean = false,
  pendingTier: string | null = null
) {
  const existingSubscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  if (existingSubscription.length) {
    await db
      .update(subscriptions)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        tier,
        status,
        stripeCurrentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd,
        pendingTier,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      tier,
      status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
      cancelAtPeriodEnd,
      pendingTier,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await updateUserSubscriptionTier(userId, tier);
}

/**
 * Gets user data from Stripe customer.
 * This function is used by the webhook handler
 */
export async function getUserFromCustomer(customerId: string): Promise<{ userId: string | null; email: string | null; fullName: string | null | undefined }> {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return { userId: null, email: null, fullName: null };
    }

    return { userId: (customer as Stripe.Customer).metadata?.userId || null, email: customer.email, fullName: customer.name };
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return { userId: null, email: null, fullName: null };
  }
}
