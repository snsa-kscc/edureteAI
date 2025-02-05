import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/chat";
import { Changelog } from "@/components/changelog";
import { ModeToggle } from "@/components/mode-toggle";
import { Title } from "@/components/title";
import { AppSidebar } from "@/components/app-sidebar";
import { getChat } from "@/lib/redis-actions";
import { AI } from "@/app/ai";

// export const maxDuration = 60;
export const runtime = "edge";
// export const dynamic = "force-dynamic";

const DEFAULT_SYSTEM_PROMPT = `As an assistant, when providing mathematical content, ensure that all formulas and equations are written in plain text or Unicode. Do not use LaTeX or any other coding format. Present the information in a straightforward and accessible manner.`;
const DEFAULT_LEFT_MODEL = "gpt-4o";
const DEFAULT_RIGHT_MODEL = "claude-3-5-sonnet-20241022";

type Params = Promise<{ id: string }>;

export default async function ChatPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const chat = await getChat(params.id);

  const { orgRole, sessionClaims } = await auth();
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
          {orgRole && (
            <Button variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <Changelog />
          <div className="flex gap-2">
            <ModeToggle />
            <div className="flex items-center">{userId && <UserButton />}</div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-evenly">
          <AI
            initialAIState={{
              userId: chat?.userId ?? userId,
              chatId: params.id,
              chatAreaId: "left",
              messages: chat?.leftMessages ?? [],
              model: chat?.leftModel ?? DEFAULT_LEFT_MODEL,
              system: chat?.leftSystemPrompt ?? DEFAULT_SYSTEM_PROMPT,
            }}
            initialUIState={[]}
          >
            <Chat
              userId={userId}
              id={params.id}
              initialModel={chat?.leftModel ?? DEFAULT_LEFT_MODEL}
              initialSystem={chat?.leftSystemPrompt ?? DEFAULT_SYSTEM_PROMPT}
            />
          </AI>
          <AI
            initialAIState={{
              userId: chat?.userId ?? userId,
              chatId: params.id,
              chatAreaId: "right",
              messages: chat?.rightMessages ?? [],
              model: chat?.rightModel ?? DEFAULT_RIGHT_MODEL,
              system: chat?.rightSystemPrompt ?? DEFAULT_SYSTEM_PROMPT,
            }}
            initialUIState={[]}
          >
            <Chat
              userId={userId}
              id={params.id}
              initialModel={chat?.rightModel ?? DEFAULT_RIGHT_MODEL}
              initialSystem={chat?.rightSystemPrompt ?? DEFAULT_SYSTEM_PROMPT}
            />
          </AI>
        </div>
        <div className="text-xs opacity-40 px-4 py-2">AI may make mistakes. Double-check your work.</div>
      </main>
    </SidebarProvider>
  );
}
