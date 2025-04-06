import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { togetherai } from "@ai-sdk/togetherai";
import { google } from "@ai-sdk/google";
import { getYesterdayUsage, getUserQuota } from "./neon-actions";
import { MODEL_CONFIGS } from "./model-config";
import { type UserData } from "@/types";
import { customProvider, wrapLanguageModel, defaultSettingsMiddleware, extractReasoningMiddleware } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modelProvider = customProvider({
  languageModels: {
    "accounts/fireworks/models/deepseek-r1": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
    }),
    "gemini-2.5-pro-exp-03-25": google("gemini-2.5-pro-exp-03-25"),
    "gemini-2.0-flash": google("gemini-2.0-flash"),
    "gemini-2.0-flash-thinking-exp-01-21": google("gemini-2.0-flash-thinking-exp-01-21"),
    "o1-mini": openai("o1-mini"),
    "o3-mini": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            openai: {
              reasoningEffort: "high",
            } satisfies OpenAIResponsesProviderOptions,
          },
        },
      }),
      model: openai("o3-mini"),
    }),
    "gpt-4o": openai("gpt-4o"),
    "gpt-4o-mini": openai("gpt-4o-mini"),
    "claude-3-7-sonnet-latest": anthropic("claude-3-7-sonnet-latest"),
    "claude-3.7-sonnet": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "disabled", budgetTokens: 12000 },
            },
          },
        },
      }),
      model: anthropic("claude-3-7-sonnet-latest"),
    }),
    "claude-3.7-sonnet-thinking": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: 5000 },
            },
          },
        },
      }),
      model: anthropic("claude-3-7-sonnet-latest"),
    }),
  },
});

export function handleModelProvider(model: string) {
  if (model.startsWith("claude")) {
    return anthropic(model);
  } else if (model.startsWith("accounts")) {
    return fireworks(model);
  } else if (model.startsWith("gemini")) {
    return google(model);
  } else if (model.startsWith("deepseek")) {
    return togetherai(model);
  } else {
    return openai(model);
  }
}

export async function getUsersUsage(usersData: UserData[], modelFamily: string) {
  const res = await Promise.all(
    usersData.map(async ({ userId, firstName, lastName, emailAddress }) => {
      const { totalTokensUsed, totalCost, quotaLimit } = await getUserQuota(userId, modelFamily);
      return {
        userId,
        firstName,
        lastName,
        emailAddress,
        tokens: totalTokensUsed,
        amount: +totalCost,
        limit: +quotaLimit,
      };
    })
  );
  return res;
}

export async function getUsersYesterdayUsage(usersData: UserData[], modelFamily: string) {
  const res = await Promise.all(
    usersData.map(async ({ userId }) => {
      const { totalTokens, totalCost } = await getYesterdayUsage(userId, modelFamily);
      return {
        userId,
        tokens: +totalTokens,
        amount: +totalCost,
      };
    })
  );
  return res;
}

export function getUniqueFamilies(): string[] {
  return [...new Set(Object.values(MODEL_CONFIGS).map((model) => model.family))].sort();
}

// deprecated

export function tokensToDollars(tokens: number): number {
  return Number((tokens / 66_666).toFixed(4));
}

export function dollarsToTokens(dollars: number): number {
  return Math.round(dollars * 66_666);
}
