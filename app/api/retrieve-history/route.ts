import { Redis } from "@upstash/redis";
import { createClient } from "@vercel/kv";

// export const runtime = "edge";
//const client = Redis.fromEnv();
const client = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
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
