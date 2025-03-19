"use server";

import { db } from "@/db";
import { message_counts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MESSAGE_TIER, MESSAGE_LIMITS, PREMIUM_MODELS } from "./model-config";

export async function getUserMessageCounts(userId: string) {
  const [existingCounts] = await db.select().from(message_counts).where(eq(message_counts.userId, userId));

  if (!existingCounts) {
    const [newCounts] = await db
      .insert(message_counts)
      .values({
        userId,
        totalMessages: 0,
        premiumModelMessages: 0,
        subscriptionTier: MESSAGE_TIER.FREE,
        updatedAt: new Date(),
      })
      .returning();

    return newCounts;
  }

  return existingCounts;
}

function isPremiumModel(modelName: string): boolean {
  return PREMIUM_MODELS.includes(modelName);
}

export async function checkMessageAvailability(
  userId: string,
  modelName: string
): Promise<{
  hasAvailability: boolean;
  remaining: number;
  message?: string;
}> {
  const userCounts = await getUserMessageCounts(userId);
  const isPremium = isPremiumModel(modelName);
  const tier = userCounts.subscriptionTier;
  const tierLimits = MESSAGE_LIMITS[tier] || MESSAGE_LIMITS[MESSAGE_TIER.FREE];

  // Check total message usage first for all tiers
  const totalRemaining = tierLimits.TOTAL_MESSAGES - userCounts.totalMessages;
  if (totalRemaining <= 0) {
    return {
      hasAvailability: false,
      remaining: 0,
      message:
        tier === MESSAGE_TIER.FREE
          ? "You have reached your free tier message limit. Please upgrade to continue."
          : "You have reached your message limit. Please contact support.",
    };
  }

  // For paid tier users, check premium model usage separately
  if (tier === MESSAGE_TIER.PAID && isPremium) {
    const premiumRemaining = tierLimits.PREMIUM_MODEL_MESSAGES - userCounts.premiumModelMessages;
    if (premiumRemaining <= 0) {
      return {
        hasAvailability: false,
        remaining: 0,
        message: "You have reached your premium model message limit. Please try a different model.",
      };
    }

    return {
      hasAvailability: true,
      remaining: Math.min(totalRemaining, premiumRemaining),
      message: `You have ${premiumRemaining} premium model messages remaining.`,
    };
  }

  // For free tier or paid tier with non-premium models
  return {
    hasAvailability: true,
    remaining: totalRemaining,
    message: `You have ${totalRemaining} messages remaining.`,
  };
}

export async function incrementMessageCount(userId: string, modelName: string): Promise<void> {
  const userCounts = await getUserMessageCounts(userId);
  const isPremium = isPremiumModel(modelName);

  await db
    .update(message_counts)
    .set({
      totalMessages: userCounts.totalMessages + 1,
      premiumModelMessages: isPremium ? userCounts.premiumModelMessages + 1 : userCounts.premiumModelMessages,
      updatedAt: new Date(),
    })
    .where(eq(message_counts.userId, userId));
}

export async function updateUserSubscriptionTier(userId: string, tier: string): Promise<void> {
  // Validate tier is a valid option
  if (!Object.values(MESSAGE_TIER).includes(tier)) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  await db
    .update(message_counts)
    .set({
      subscriptionTier: tier,
      updatedAt: new Date(),
    })
    .where(eq(message_counts.userId, userId));
}
