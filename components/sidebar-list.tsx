import { getChats } from "@/lib/actions";
import { SidebarItems } from "./sidebar-items";
import { cache } from "react";

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export async function SidebarList({ userId }: { userId: string | null }) {
  const chats = await loadChats(userId!);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems userId={userId} chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4"></div>
    </div>
  );
}
