"use server";

import { Redis } from "@upstash/redis";
import { Chat, Usage, UserQuota } from "@/types";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { dollarsToTokens } from "./utils";

const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  enableAutoPipelining: true,
  retry: {
    retries: 5,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});

export async function getUsersData() {
  try {
    const userIds: string[] = await client.smembers("userIds");
    const clerk = await clerkClient();
    const allUsers = await clerk.users.getUserList();
    const usersData: { userId: string; firstName: string; lastName: string; emailAddress: string; role: string }[] = [];
    for (const storedId of userIds) {
      const user = allUsers.data.find((u) => u.externalId === storedId || u.id === storedId);
      const userId = user?.externalId || user!.id;

      // const orgMemberships = await clerk.users.getOrganizationMembershipList({ userId: user!.id });
      // const role = orgMemberships.data[0]?.role || "student";

      const role = (user?.privateMetadata.role as string) ?? "student";
      const emailAddress = user!.emailAddresses[0].emailAddress;
      const firstName = user?.firstName ?? "";
      const lastName = user?.lastName ?? "";
      usersData.push({ userId, firstName, lastName, emailAddress, role });
      usersData.sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
    return usersData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getChats(userId?: string | null | undefined) {
  if (!userId) {
    return [];
  }

  try {
    const pipeline = client.pipeline();
    const chats: string[] = await client.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true,
    });

    for (const chat of chats) {
      pipeline.hgetall(chat);
    }

    const results = await pipeline.exec();

    return results as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const chat = await client.hgetall<Chat>(`chat:${id}`);

  if (!chat) {
    return null;
  }

  return chat;
}

export async function saveChat(chat: Chat) {
  try {
    const pipeline = client.pipeline();

    pipeline.hmset(`chat:${chat.id}`, chat);
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`,
    });
    pipeline.sadd(`userIds`, chat.userId);

    await pipeline.exec();
  } catch (error) {
    console.error("Error in saveChat function:", error);
  }
}

export async function removeChat({ id, path, userId }: { id: string; path: string; userId: string | null | undefined }) {
  await client.del(`chat:${id}`);
  await client.zrem(`user:chat:${userId!}`, `chat:${id}`);

  revalidatePath("/");
  return revalidatePath(path);
}

// deprecated

export async function saveUsage(usage: Usage) {
  const key = `usage:${usage.userId}:${usage.model}:${usage.timestamp.toISOString().split("T")[0]}`;

  const exists = await client.exists(key);

  if (exists) {
    await client.hincrby(key, "promptTokens", usage.promptTokens);
    await client.hincrby(key, "completionTokens", usage.completionTokens);
    await client.hincrby(key, "totalTokens", usage.totalTokens);
  } else {
    await client.hset(key, {
      model: usage.model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
    });
  }

  await updateUserQuota(usage.userId, usage.model, usage.totalTokens);
}

export async function getUserQuota(userId: string, model: string) {
  if (model.startsWith("gpt")) {
    const key = `quota:${userId}:gpt`;
    const quota = await client.hgetall(key);

    if (!quota) {
      const newQuota: UserQuota = {
        userId,
        totalTokensUsed: 0,
        quotaLimit: 66_666 * 2,
      };
      await client.hset(key, newQuota);
      return newQuota;
    }

    return {
      userId,
      totalTokensUsed: Number(quota.totalTokensUsed),
      quotaLimit: Number(quota.quotaLimit),
    };
  } else {
    const key = `quota:${userId}:anthropic`;
    const quota = await client.hgetall(key);

    if (!quota) {
      const newQuota: UserQuota = {
        userId,
        totalTokensUsed: 0,
        quotaLimit: 66_666 * 2,
      };
      await client.hset(key, newQuota);
      return newQuota;
    }

    return {
      userId,
      totalTokensUsed: Number(quota.totalTokensUsed),
      quotaLimit: Number(quota.quotaLimit),
    };
  }
}

export async function updateUserQuota(userId: string, model: string, tokensUsed: number) {
  if (model.startsWith("gpt")) {
    const key = `quota:${userId}:gpt`;
    const quota = await getUserQuota(userId, model);

    const updatedQuota = {
      ...quota,
      totalTokensUsed: quota.totalTokensUsed + tokensUsed,
    };

    await client.hset(key, updatedQuota);
    return updatedQuota;
  } else {
    const key = `quota:${userId}:anthropic`;
    const quota = await getUserQuota(userId, model);

    const updatedQuota = {
      ...quota,
      totalTokensUsed: quota.totalTokensUsed + tokensUsed,
    };

    await client.hset(key, updatedQuota);
    return updatedQuota;
  }
}

export async function checkQuota(userId: string, model: string) {
  const quota = await getUserQuota(userId, model);
  return quota.totalTokensUsed < quota.quotaLimit;
}

export async function updateUserLimit(userId: string, model: string, amount: number) {
  const limitInTokens = dollarsToTokens(amount);
  if (model.startsWith("gpt")) {
    const key = `quota:${userId}:gpt`;
    const quota = await getUserQuota(userId, model);

    const updatedQuota = {
      ...quota,
      quotaLimit: limitInTokens,
    };

    await client.hset(key, updatedQuota);
    return updatedQuota;
  } else {
    const key = `quota:${userId}:anthropic`;
    const quota = await getUserQuota(userId, model);

    const updatedQuota = {
      ...quota,
      quotaLimit: limitInTokens,
    };

    await client.hset(key, updatedQuota);
    return updatedQuota;
  }
}
