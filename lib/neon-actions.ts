"use server";

import { db } from "@/db";
import { usage, quotas, limits, referrals } from "@/db/schema";
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
  yesterday.setDate(yesterday.getDate() - 1);

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

  const [quota] = await db
    .select()
    .from(quotas)
    .where(and(eq(quotas.userId, userId), eq(quotas.modelFamily, modelFamily), gt(quotas.updatedAt, startOfMonth), lt(quotas.updatedAt, endOfMonth)));

  const [userLimit] = await db
    .select()
    .from(limits)
    .where(and(eq(limits.userId, userId), eq(limits.modelFamily, modelFamily)));

  const defaultLimit = 2;

  if (!quota) {
    return {
      totalTokensUsed: 0,
      totalCost: "0",
      quotaLimit: userLimit?.quotaLimit ?? defaultLimit,
    };
  }

  return {
    totalTokensUsed: quota.totalTokensUsed,
    totalCost: quota.totalCost,
    quotaLimit: userLimit?.quotaLimit ?? defaultLimit,
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
      updatedAt: new Date(),
    });
  }
}

export async function updateUserLimit(userId: string, modelFamily: string, amount: number) {
  const [existingLimit] = await db
    .select()
    .from(limits)
    .where(and(eq(limits.userId, userId), eq(limits.modelFamily, modelFamily)));

  if (existingLimit) {
    await db
      .update(limits)
      .set({
        quotaLimit: amount.toFixed(2),
        updatedAt: new Date(),
      })
      .where(and(eq(limits.userId, userId), eq(limits.modelFamily, modelFamily)));
  } else {
    await db.insert(limits).values({
      userId,
      modelFamily,
      quotaLimit: amount.toFixed(2),
      updatedAt: new Date(),
    });
  }
}

export async function checkQuota(userId: string, model: string): Promise<boolean> {
  const modelFamily = MODEL_CONFIGS[model].family;
  const quota = await getUserQuota(userId, modelFamily);
  return quota.totalCost < quota.quotaLimit;
}

export async function saveReferral(referrerId: string, referredId: string) {
  await db.insert(referrals).values({
    referrerId,
    referredId,
    createdAt: new Date(),
  });
}

export async function getReferrals(referrerId: string) {
  return await db.select().from(referrals).where(eq(referrals.referrerId, referrerId));
}
