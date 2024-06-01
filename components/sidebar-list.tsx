import { getChats } from "@/lib/actions";
import { SidebarItems } from "./sidebar-items";
import { cache } from "react";

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export async function SidebarList({ userId }: { userId: string | null }) {
  const chats = await loadChats(userId!);

  return (
    <div className="h-full overflow-auto scrollbar-thin">
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
  );
}
