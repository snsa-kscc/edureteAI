"use server";

import { Redis } from "@upstash/redis";
import { Chat } from "./types";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

const client = Redis.fromEnv();

export async function getUserData() {
  try {
    const userIds: string[] = await client.smembers("userIds");
    const userData: Record<string, string> = {};
    for (const userId of userIds) {
      const user = await clerkClient.users.getUser(userId);
      const emailAddress = user.emailAddresses[0].emailAddress;
      userData[userId] = emailAddress;
    }
    return userData;
  } catch (error) {
    return {};
  }
}

export async function getChats(userId?: string | null) {
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

export async function getChat(id: string, userId: string) {
  const chat = await client.hgetall<Chat>(`chat:${id}`);

  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return chat;
}

export async function saveChat(chat: Chat) {
  const pipeline = client.pipeline();

  pipeline.hmset(`chat:${chat.id}`, chat);
  pipeline.zadd(`user:chat:${chat.userId}`, {
    score: Date.now(),
    member: `chat:${chat.id}`,
  });
  pipeline.sadd(`userIds`, chat.userId);

  await pipeline.exec();
}

export async function removeChat({ id, path, userId }: { id: string; path: string; userId: string | null }) {
  await client.del(`chat:${id}`);
  await client.zrem(`user:chat:${userId!}`, `chat:${id}`);

  revalidatePath("/");
  return revalidatePath(path);
}
