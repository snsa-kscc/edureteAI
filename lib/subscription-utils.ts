import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MESSAGE_TIER, MESSAGE_LIMITS } from "@/lib/model-config";

/**
 * Get the current subscription for a user
 * @param userId The user ID
 * @returns The subscription object or null if not found
 */
export async function getUserSubscription(userId: string) {
  if (!userId) return null;

  const userSubscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  if (!userSubscription.length) return null;

  const subscription = userSubscription[0];

  const isActive = subscription.status === "active" && subscription.stripeCurrentPeriodEnd && new Date(subscription.stripeCurrentPeriodEnd) > new Date();

  if (!isActive) {
    return {
      ...subscription,
      status: "inactive",
      tier: MESSAGE_TIER.FREE,
    };
  }

  return subscription;
}

/**
 * Check if a user has an active subscription
 * @param userId The user ID
 * @returns Boolean indicating if the user has an active subscription
 */
export async function hasActiveSubscription(userId: string) {
  const subscription = await getUserSubscription(userId);

  return (
    subscription?.status === "active" &&
    subscription?.tier !== MESSAGE_TIER.FREE &&
    subscription?.stripeCurrentPeriodEnd &&
    new Date(subscription.stripeCurrentPeriodEnd) > new Date()
  );
}

/**
 * Check if a subscription has payment issues
 * @param userId The user ID
 * @returns Payment status information
 */
export async function getSubscriptionPaymentStatus(userId: string) {
  // Default response
  const defaultResponse = {
    hasPaymentIssue: false,
    status: "active",
    message: "",
  };

  if (!userId) {
    return defaultResponse;
  }

  // Get the subscription from our database
  const userSubscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  if (!userSubscription.length) {
    return defaultResponse;
  }

  const subscription = userSubscription[0];

  // Handle different statuses
  switch (subscription.status) {
    case "past_due":
      return {
        hasPaymentIssue: true,
        status: "past_due",
        message: "Your payment failed. Please update your payment method to continue your subscription.",
      };
    case "unpaid":
      return {
        hasPaymentIssue: true,
        status: "unpaid",
        message: "Your subscription is unpaid. Please update your payment information.",
      };
    case "incomplete":
      return {
        hasPaymentIssue: true,
        status: "incomplete",
        message: "Your subscription setup is incomplete. Please update your payment information.",
      };
    case "incomplete_expired":
      return {
        hasPaymentIssue: true,
        status: "incomplete_expired",
        message: "Your subscription setup has expired. Please subscribe again.",
      };
    default:
      return defaultResponse;
  }
}

/**
 * Get the appropriate message limits for a user based on their subscription tier
 * @param userId The user ID
 * @returns Object with message limits for the user
 */
export async function getUserMessageLimits(userId: string) {
  const subscription = await getUserSubscription(userId);

  // Default to free tier
  let totalMessages = MESSAGE_LIMITS[MESSAGE_TIER.FREE].TOTAL_MESSAGES;
  let premiumModelMessages = MESSAGE_LIMITS[MESSAGE_TIER.FREE].PREMIUM_MODEL_MESSAGES;

  // If user has an active subscription, use the paid tier limits
  if (
    subscription?.status === "active" &&
    subscription?.tier !== MESSAGE_TIER.FREE &&
    subscription?.stripeCurrentPeriodEnd &&
    new Date(subscription.stripeCurrentPeriodEnd) > new Date()
  ) {
    // Get the appropriate tier limits
    const tierLimits = MESSAGE_LIMITS[subscription.tier as keyof typeof MESSAGE_LIMITS] || MESSAGE_LIMITS[MESSAGE_TIER.PAID];

    totalMessages = tierLimits.TOTAL_MESSAGES;
    premiumModelMessages = tierLimits.PREMIUM_MODEL_MESSAGES;
  }

  return {
    totalMessages,
    premiumModelMessages,
  };
}
