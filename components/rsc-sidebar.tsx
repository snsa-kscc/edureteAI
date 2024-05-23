import { getChats } from "@/lib/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { cache } from "react";
import { buttonVariants } from "@/components/ui/button";

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId);
});

export async function RscSidebar({ userId }: { userId: string | null }) {
  const chats = await loadChats(userId!);

  return (
    <div className="min-w-60 max-h-[720px] overflow-scroll flex flex-col justify-top px-2">
      <div className="mb-2 px-2">
        <Link
          href="/rsc-c"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
          )}
        >
          New Chat
        </Link>
      </div>
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/rsc-c/${chat.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10 my-1"
          )}
        >
          {chat.title}
        </Link>
      ))}
    </div>
  );
}
