import { auth, currentUser } from "@clerk/nextjs/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Chat } from "@/components/use-chat";
import { ModeToggle } from "@/components/mode-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { DEFAULT_LEFT_MODEL, DEFAULT_RIGHT_MODEL, DEFAULT_USER_SYSTEM_PROMPT } from "@/lib/chat-config";
import { getChat } from "@/lib/redis-actions";

type Params = Promise<{ id: string }>;

export default async function ChatPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const chat = await getChat(params.id);
  const user = await currentUser();
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;

  return (
    <SidebarProvider>
      <AppSidebar userId={chat?.userId ?? userId} user={user} />
      <main className="w-full h-screen max-h-screen overflow-hidden grid grid-rows-[auto_1fr_auto]">
        <div className="m-4 flex items-center gap-2 justify-between">
          <SidebarTrigger className="w-10 h-10 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer hover:bg-transparent" />
          <ModeToggle className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer border-0 hover:bg-transparent" />
        </div>
        <div className="flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto">
          <Chat
            isOwner={!chat || ((chat.userId && chat.userId === userId) as boolean)}
            userId={userId}
            userName={user?.firstName}
            chatId={params.id}
            chatAreaId="left"
            initialModel={chat?.leftModel ?? DEFAULT_LEFT_MODEL}
            initialSystemMessage={chat?.leftSystemPrompt ?? DEFAULT_USER_SYSTEM_PROMPT}
            initialMessages={chat?.leftMessages}
          />
          <Chat
            isOwner={!chat || ((chat.userId && chat.userId === userId) as boolean)}
            userId={userId}
            userName={user?.firstName}
            chatId={params.id}
            chatAreaId="right"
            initialModel={chat?.rightModel ?? DEFAULT_RIGHT_MODEL}
            initialSystemMessage={chat?.rightSystemPrompt ?? DEFAULT_USER_SYSTEM_PROMPT}
            initialMessages={chat?.rightMessages}
          />
        </div>
        <div className="text-xs opacity-40 px-4 pb-4 pt-2 lg:pt-0">AI može pogriješiti. Misli na to.</div>
      </main>
    </SidebarProvider>
  );
}
