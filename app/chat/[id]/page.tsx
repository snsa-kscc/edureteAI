import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/ui-chat";
import { ModeToggle } from "@/components/mode-toggle";
import { Title } from "@/components/title";
import { AppSidebar } from "@/components/app-sidebar";
import { getChat } from "@/lib/redis-actions";

const DEFAULT_LEFT_MODEL = "gemini-2.0-flash";
const DEFAULT_RIGHT_MODEL = "claude-3-5-sonnet-20241022";
const DEFAULT_USER_SYSTEM_PROMPT = "Write your answer in LaTeX notation.";

type Params = Promise<{ id: string }>;

export default async function ChatPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const chat = await getChat(params.id);

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;

  return (
    <SidebarProvider>
      <AppSidebar userId={chat?.userId ?? userId} />
      <main className="w-full">
        <div className="m-4">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 px-8 pt-2 pb-4">
          <Title />
          {sessionClaims?.membership && Object.keys(sessionClaims.membership).length > 0 && (
            <Button variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <div className="flex gap-2">
            <ModeToggle />
            <div className="flex items-center">{userId && <UserButton />}</div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-evenly">
          <Chat
            userId={userId}
            id={params.id}
            chatAreaId="left"
            initialModel={chat?.leftModel ?? DEFAULT_LEFT_MODEL}
            initialSystem={chat?.leftSystemPrompt ?? DEFAULT_USER_SYSTEM_PROMPT}
            initialMessages={chat?.leftMessages}
          />
          <Chat
            userId={userId}
            id={params.id}
            chatAreaId="right"
            initialModel={chat?.rightModel ?? DEFAULT_RIGHT_MODEL}
            initialSystem={chat?.rightSystemPrompt ?? DEFAULT_USER_SYSTEM_PROMPT}
            initialMessages={chat?.rightMessages}
          />
        </div>
        <div className="text-xs opacity-40 px-4 py-2">AI may make mistakes. Double-check your work.</div>
      </main>
    </SidebarProvider>
  );
}
