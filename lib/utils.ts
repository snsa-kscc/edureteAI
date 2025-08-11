import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { togetherai } from "@ai-sdk/togetherai";
import { google } from "@ai-sdk/google";
import { getYesterdayUsage, getUserQuota } from "./neon-actions";
import { MODEL_CONFIGS } from "./model-config";
import { type UserData } from "@/types";
import { customProvider, wrapLanguageModel, defaultSettingsMiddleware, extractReasoningMiddleware } from "ai";

// Logit bias configuration types
export interface LogitBiasConfig {
  [tokenId: string]: number; // Token ID to bias value (-100 to 100)
}

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
    "gemini-2.5-pro": google("gemini-2.5-pro"),
    "gemini-2.5-flash": google("gemini-2.5-flash"),

    "o1-mini": openai("o1-mini"),
    "o3-mini": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          temperature: 1,
          providerOptions: {
            openai: {
              reasoningEffort: "high",
            },
          },
        },
      }),
      model: openai("o3-mini"),
    }),
    "o4-mini": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          temperature: 1,
          providerOptions: {
            openai: {
              reasoningEffort: "high",
            },
          },
        },
      }),
      model: openai("o4-mini"),
    }),
    "gpt-4o": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          temperature: 0.3,
          providerMetadata: {
            openai: {
              logitBias: { "29992": -100, "29993": -100 },
            },
          },
        },
      }),
      model: openai("gpt-4o"),
    }),
    "gpt-4o-mini": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          temperature: 0.3,
          providerMetadata: {
            openai: {
              logitBias: { "29992": -100, "29993": -100 },
            },
          },
        },
      }),
      model: openai("gpt-4o-mini"),
    }),
    "gpt-4.1": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            openai: {
              logitBias: { "29992": -100, "29993": -100 },
            },
          },
        },
      }),
      model: openai("gpt-4.1"),
    }),
    "gpt-4.1-mini": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            openai: {
              logitBias: { "29992": -100, "29993": -100 },
            },
          },
        },
      }),
      model: openai("gpt-4.1-mini"),
    }),
    "gpt-4.1-nano": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            openai: {
              logitBias: { "29992": -100, "29993": -100 },
            },
          },
        },
      }),
      model: openai("gpt-4.1-nano"),
    }),
    "claude-sonnet-4-20250514": anthropic("claude-sonnet-4-20250514"),
    "claude sonnet 4": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            anthropic: {
              thinking: { type: "disabled", budgetTokens: 12000 },
            },
          },
        },
      }),
      model: anthropic("claude-sonnet-4-20250514"),
    }),
    "claude-sonnet-4-thinking": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: 5000 },
            },
          },
        },
      }),
      model: anthropic("claude-sonnet-4-20250514"),
    }),
  },
});

// deperacted function - DEAD INSIDE LIKE MY SOUL

export function handleModelProvider(model: string, logitBias?: LogitBiasConfig) {
  if (model.startsWith("claude")) {
    return anthropic(model);
  } else if (model.startsWith("accounts")) {
    return fireworks(model);
  } else if (model.startsWith("gemini")) {
    return google(model);
  } else if (model.startsWith("deepseek")) {
    return togetherai(model);
  } else {
    // For OpenAI models, apply logit bias if provided
    if (logitBias) {
      return wrapLanguageModel({
        middleware: defaultSettingsMiddleware({
          settings: {
            providerMetadata: {
              openai: {
                logitBias,
              },
            },
          },
        }),
        model: openai(model),
      });
    }
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
