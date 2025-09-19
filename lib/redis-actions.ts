"use server";

import { Redis } from "@upstash/redis";
import { Chat } from "@/types";
import { revalidatePath } from "next/cache";
import { clerkClient, type User } from "@clerk/nextjs/server";

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
    const allUsers = await clerk.users.getUserList({ limit: 499 });
    const usersData: { userId: string; firstName: string; lastName: string; emailAddress: string; role: string; createdAt: Date }[] = [];
    for (const storedId of userIds) {
      const user = allUsers.data.find((u: User) => u.externalId === storedId || u.id === storedId);
      if (!user) {
        continue;
      }
      const userId = user.externalId || user.id;

      // const orgMemberships = await clerk.users.getOrganizationMembershipList({ userId: user!.id });
      // const role = orgMemberships.data[0]?.role || "student";

      const role = (user.privateMetadata.role as string) ?? "student";
      const emailAddress = user.emailAddresses[0].emailAddress;
      const firstName = user.firstName ?? "No";
      const lastName = user.lastName ?? "Name";
      const createdAt = new Date(user.createdAt);
      usersData.push({ userId, firstName, lastName, emailAddress, role, createdAt });
    }
    
    // Sort once after all users are processed
    usersData.sort((a, b) => a.lastName.localeCompare(b.lastName));
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
    // Filter out null values and convert them to empty strings because system can be null
    const cleanChat = Object.fromEntries(Object.entries(chat).map(([key, value]) => [key, value ?? ""]));
    const pipeline = client.pipeline();

    pipeline.hmset(`chat:${chat.id}`, cleanChat);
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
