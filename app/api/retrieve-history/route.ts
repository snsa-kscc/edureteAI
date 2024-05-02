import { Redis } from "@upstash/redis";

const client = Redis.fromEnv();
export const runtime = "edge";
interface RequestJson {
  userId: string;
  chatHistoryAction: string;
}

export async function POST(req: Request): Promise<Response> {
  const { userId, chatHistoryAction } = (await req.json()) as RequestJson;

  if (chatHistoryAction === "retrieve") {
    const chatKeys = await client.keys(`${userId}-*`);
    return new Response(JSON.stringify(chatKeys));
  }

  return new Response("error");
}
