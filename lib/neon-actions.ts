"use server";

import { db } from "@/db";
import { usage, quotas } from "@/db/schema";
import { MODEL_CONFIGS } from "./model-config";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { Usage } from "@/types";

export async function saveUsage(usageData: Usage) {
  const modelConfig = MODEL_CONFIGS[usageData.model];
  const modelFamily = modelConfig.family;
  if (!modelConfig) {
    throw new Error(`Unknown model: ${usageData.model}`);
  }

  const inputCost = (usageData.promptTokens / 1_000_000) * modelConfig.inputPrice;
  const outputCost = (usageData.completionTokens / 1_000_000) * modelConfig.outputPrice;
  const totalCost = inputCost + outputCost;

  const currentDate = new Date(usageData.timestamp).toISOString().split("T")[0];

  const existingUsage = await db.query.usage.findFirst({
    where: (usage, { and, eq }) => and(eq(usage.userId, usageData.userId), eq(usage.model, usageData.model), eq(sql`DATE(${usage.timestamp})`, currentDate)),
  });

  if (existingUsage) {
    await db
      .update(usage)
      .set({
        promptTokens: existingUsage.promptTokens + usageData.promptTokens,
        completionTokens: existingUsage.completionTokens + usageData.completionTokens,
        totalTokens: existingUsage.totalTokens + usageData.totalTokens,
        cost: (+existingUsage.cost + totalCost).toFixed(4),
      })
      .where(eq(usage.id, existingUsage.id));
  } else {
    await db.insert(usage).values({
      userId: usageData.userId,
      model: usageData.model,
      modelFamily,
      promptTokens: usageData.promptTokens,
      completionTokens: usageData.completionTokens,
      totalTokens: usageData.totalTokens,
      cost: totalCost.toFixed(4),
      timestamp: usageData.timestamp,
    });
  }

  await updateUserQuota(usageData.userId, usageData.model, usageData.totalTokens, totalCost);
}

export async function getYesterdayUsage(userId: string, modelFamily: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 3); // 3 days ago

  const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
  const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

  const yesterdayUsage = await db
    .select({
      totalTokens: sql`SUM(${usage.totalTokens})`,
      totalCost: sql`SUM(CAST(${usage.cost} AS DECIMAL(10,4)))`,
    })
    .from(usage)
    .where(and(eq(usage.userId, userId), eq(usage.modelFamily, modelFamily), gt(usage.timestamp, startOfYesterday), lt(usage.timestamp, endOfYesterday)));

  return {
    totalTokens: yesterdayUsage[0].totalTokens || 0,
    totalCost: Number(yesterdayUsage[0].totalCost || 0).toFixed(4),
  };
}

export async function getUserQuota(userId: string, modelFamily: string) {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); // First day of the last month
  const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59, 999); // Last day of the last month

  const [quota] = await db
    .select()
    .from(quotas)
    .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, modelFamily), gt(quotas.updatedAt, startOfLastMonth), lt(quotas.updatedAt, endOfLastMonth)));

  if (!quota) {
    return {
      totalTokensUsed: 0,
      totalCost: 0,
      quotaLimit: 2,
    };
  }

  return {
    totalTokensUsed: quota.totalTokensUsed,
    totalCost: quota.totalCost,
    quotaLimit: quota.quotaLimit,
  };
}

export async function updateUserQuota(userId: string, model: string, tokensUsed: number, cost: number) {
  const modelFamily = MODEL_CONFIGS[model].family;
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const [existingQuota] = await db
    .select()
    .from(quotas)
    .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, modelFamily), gt(quotas.updatedAt, startOfMonth), lt(quotas.updatedAt, endOfMonth)));

  if (existingQuota) {
    await db
      .update(quotas)
      .set({
        totalTokensUsed: existingQuota.totalTokensUsed + tokensUsed,
        totalCost: (+existingQuota.totalCost + cost).toFixed(4),
        updatedAt: new Date(),
      })
      .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, modelFamily), gt(quotas.updatedAt, startOfMonth), lt(quotas.updatedAt, endOfMonth)));
  } else {
    await db.insert(quotas).values({
      userId,
      modelFamily,
      totalTokensUsed: tokensUsed,
      totalCost: cost.toFixed(4),
      quotaLimit: "2.0",
      updatedAt: new Date(),
    });
  }
}

export async function updateUserLimit(userId: string, model: string, amount: number) {
  const modelFamily = MODEL_CONFIGS[model].family;
  const [existingQuota] = await db
    .select()
    .from(quotas)
    .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, model)));

  if (existingQuota) {
    await db
      .update(quotas)
      .set({
        quotaLimit: amount.toFixed(2),
        updatedAt: new Date(),
      })
      .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, modelFamily)));
  } else {
    await db.insert(quotas).values({
      userId,
      modelFamily,
      totalTokensUsed: 0,
      totalCost: "0",
      quotaLimit: amount.toFixed(2),
      updatedAt: new Date(),
    });
  }
}

export async function checkQuota(userId: string, modelFamily: string): Promise<boolean> {
  const quota = await getUserQuota(userId, modelFamily);
  return quota.totalCost < quota.quotaLimit;
}

// Additional utility functions

export async function getDailyUsage(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db
    .select()
    .from(usage)
    .where(and(eq(usage.userId, userId), gt(usage.timestamp, startOfDay), lt(usage.timestamp, endOfDay)));
}

export async function getModelUsageSummary(userId: string, model: string) {
  const [result] = await db
    .select({
      totalPromptTokens: usage.promptTokens,
      totalCompletionTokens: usage.completionTokens,
      totalCost: usage.cost,
    })
    .from(usage)
    .where(and(eq(usage.userId, userId), eq(usage.model, model)));

  return (
    result || {
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalCost: 0,
    }
  );
}
