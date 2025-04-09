"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions, message_counts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/subscription-utils";

/**
 * Delete a user account and all associated data
 * @param userId The user ID to delete
 */
export async function deleteUserAccount(userId: string) {
  try {
    const clerk = await clerkClient();
    const { sessionClaims } = await auth();
    const authUserId = sessionClaims?.userId;

    if (!authUserId || authUserId !== userId) {
      throw new Error("Unauthorized: You can only delete your own account");
    }

    const subscription = await getUserSubscription(userId);

    if (subscription?.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    await db.delete(message_counts).where(eq(message_counts.userId, userId));
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await clerk.users.deleteUser(userId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw new Error("Failed to delete account. Please try again later.");
  }
}
