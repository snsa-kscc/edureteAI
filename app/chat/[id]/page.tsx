import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ModeToggle } from "@/components/mode-toggle";
import { Changelog } from "@/components/changelog";

import { redirect } from "next/navigation";

import Chat from "@/components/chat";
import Title from "@/components/title";
import Sidebar from "@/components/sidebar";
import { Redis } from "@upstash/redis";
import { createClient } from "@vercel/kv";

// export const runtime = "edge";

// const client = createClient({
//   url: process.env.KV_REST_API_URL!,
//   token: process.env.KV_REST_API_TOKEN!,
// });

const client = Redis.fromEnv();

const updateItem = async (id: string) => {
  "use server";
  const part = id.split("/").at(-1);
  const keys = await client.keys(`${part}*`);
  for (const key of keys) {
    await client.del(key);
  }
  return redirect(`/`);
};

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const chatKeys = await client.keys(`${params.id}//*`);

  let leftChatData;
  let rightChatData;

  if (chatKeys.length !== 0) {
    for (const key of chatKeys) {
      if (key.includes("left")) {
        leftChatData = await client.lrange(key, 0, -1);
      } else if (key.includes("right")) {
        rightChatData = await client.lrange(key, 0, -1);
      }
    }
  }

  return (
    <main className="min-h-screen">
      <div className="flex gap-2 p-8">
        <Title />
        <Changelog />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <div className="flex flex-col md:flex-row mx-4">
        <Sidebar updateItem={updateItem} />
        <Chat chatAreaId="left" chatData={leftChatData} />
        <Chat chatAreaId="right" chatData={rightChatData} />
      </div>
    </main>
  );
}
