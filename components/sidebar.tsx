import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SidebarList } from "./sidebar-list";
import { getUserData } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";

export async function Sidebar({ userId }: { userId: string | null }) {
  const data = await getUserData();
  const { orgRole } = auth();

  return (
    <div className="min-w-72 max-h-[400px] lg:max-h-[720px] flex flex-col justify-top px-2">
      <div className="mb-2 px-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
          )}
        >
          New Chat
        </Link>
        {orgRole && <pre>{orgRole}</pre>}
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        }
      >
        <SidebarList userId={userId} />
      </Suspense>
    </div>
  );
}
