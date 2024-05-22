import { Redis } from "@upstash/redis";
import { Chat } from "./types";

export async function getChat(id: string, userId: string) {
  const client = Redis.fromEnv();
  const chat = await client.hgetall<Chat>(`chat:${id}`);

  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return chat;
}

export async function saveChat(chat: Chat) {
  const client = Redis.fromEnv();
  const pipeline = client.pipeline();
  pipeline.hmset(`chat:${chat.id}`, chat);
  pipeline.zadd(`user:chat:${chat.userId}`, {
    score: Date.now(),
    member: `chat:${chat.id}`,
  });
  await pipeline.exec();
}
