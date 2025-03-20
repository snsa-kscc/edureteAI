"use server";

import { db } from "@/db";
import { message_counts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MESSAGE_TIER, MESSAGE_LIMITS, PREMIUM_MODELS } from "./model-config";

/**
 * Gets message counts for given user. If user is not present, assigns new user in free tier.
 * @param userId
 * @returns counts object
 */
export async function getUserMessageCounts(userId: string): Promise<{
  id: number;
  userId: string;
  updatedAt: Date;
  totalMessages: number;
  premiumModelMessages: number;
  subscriptionTier: string;
}> {
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

/**
 * Checks whether user has enough number of messages to chat with the model.
 * @param userId
 * @param modelName
 * @returns Availability object.
 */
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
  if (tier === (MESSAGE_TIER.PAID || MESSAGE_TIER.PAID_PLUS) && isPremium) {
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

/**
 * Increments number of messages.
 * @param userId The user ID
 * @param modelName Model name
 */
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

/**
 * Update a user's subscription tier in the message counts table. If no user is found, adds new user.
 * @param userId The user ID
 * @param tier The subscription tier
 */
export async function updateUserSubscriptionTier(userId: string, tier: string): Promise<void> {
  // Validate tier is a valid option
  if (!Object.values(MESSAGE_TIER).includes(tier)) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  const existingRecord = await db.select().from(message_counts).where(eq(message_counts.userId, userId)).limit(1);

  if (existingRecord.length) {
    await db
      .update(message_counts)
      .set({
        subscriptionTier: tier,
        updatedAt: new Date(),
      })
      .where(eq(message_counts.userId, userId));
  } else {
    await db.insert(message_counts).values({
      userId,
      subscriptionTier: tier,
      totalMessages: 0,
      premiumModelMessages: 0,
    });
  }
}

/**
 * Reset a user's message counts to zero
 * @param userId The user ID
 */
export async function resetUserMessageCounts(userId: string): Promise<void> {
  await db
    .update(message_counts)
    .set({
      totalMessages: 0,
      premiumModelMessages: 0,
      updatedAt: new Date(),
    })
    .where(eq(message_counts.userId, userId));
}
