import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { getUserQuota } from "./redis-actions";
import { getUserQuota as getUserQuotaNeon } from "./neon-actions";

type UserData = { userId: string; firstName: string; lastName: string; emailAddress: string };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleModelProvider(model: string) {
  if (model.startsWith("claude")) {
    return anthropic(model);
  } else {
    return openai(model);
  }
}

export function tokensToDollars(tokens: number): number {
  return Number((tokens / 66_666).toFixed(4));
}

export function dollarsToTokens(dollars: number): number {
  return Math.round(dollars * 66_666);
}

export async function getUsersUsage(usersData: UserData[], model: string) {
  const res = await Promise.all(
    usersData.map(async ({ firstName, lastName, emailAddress, userId }) => {
      const { totalTokensUsed, quotaLimit } = await getUserQuota(userId, model);
      return {
        userId,
        firstName,
        lastName,
        emailAddress,
        tokens: totalTokensUsed,
        amount: tokensToDollars(totalTokensUsed),
        limit: tokensToDollars(quotaLimit),
      };
    })
  );
  return res;
}

export async function getUsersUsageNeon(usersData: UserData[], modelFamily: string) {
  const res = await Promise.all(
    usersData.map(async ({ userId }) => {
      const { totalTokensUsed, totalCost, quotaLimit } = await getUserQuotaNeon(userId, modelFamily);
      return {
        userId,
        tokens: totalTokensUsed,
        amount: +totalCost,
        limit: +quotaLimit,
      };
    })
  );
  return res;
}
