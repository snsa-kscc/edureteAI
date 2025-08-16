"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Checks if user should see onboarding page
 * Returns true if user should see onboarding (new user on free tier who hasn't completed onboarding)
 */
export async function shouldShowOnboarding(userId: string): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const hasCompletedOnboarding = user.publicMetadata?.onboardingCompleted === true;

  if (hasCompletedOnboarding) {
    return false;
  }
  return true;
}

/**
 * Marks onboarding as completed for the current user
 */
export async function completeOnboarding(): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingCompleted: true,
    },
  });
}

/**
 * Checks if user is a new user (just signed up)
 * This can be used to redirect new users to onboarding
 */
export async function isNewUser(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const hasCompletedOnboarding = user.publicMetadata?.onboardingCompleted === true;

  // Check if user was created recently (within last 5 minutes) and hasn't completed onboarding
  const userCreatedAt = new Date(user.createdAt);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  return userCreatedAt > fiveMinutesAgo && !hasCompletedOnboarding;
}
