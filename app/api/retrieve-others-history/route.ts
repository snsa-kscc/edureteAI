import { Redis } from "@upstash/redis";

const client = Redis.fromEnv();

interface RequestJson {
  userId: string;
  chatHistoryAction: string;
}

export async function POST(req: Request): Promise<Response> {
  const { userId, chatHistoryAction } = (await req.json()) as RequestJson;

  if (chatHistoryAction === "retrieve") {
    const allKeys = await client.keys("*");
    const filteredKeys = allKeys.filter((key) => !key.startsWith(`${userId}-`));
    return new Response(JSON.stringify(filteredKeys));
  }

  return new Response("error");
}
