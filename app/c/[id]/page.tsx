import { Chat } from "@/components/chat";
import { Changelog } from "@/components/changelog";
import { ModeToggle } from "@/components/mode-toggle";
import { Title } from "@/components/title";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AI } from "@/app/actions";
import { getChat } from "@/lib/actions";
import { Sidebar } from "@/components/sidebar";

const DEFAULT_SYSTEM_PROMPT = `You are a reasoning AI tasked with solving the user's math-based questions. Logically arrive at the solution, and be factual. In your answers, clearly detail the steps involved and give the final answer. If you can't solve the question, say "I don't know". When responding with math formulas in the response, you must write the formulae using only Unicode from the Mathematical Operators block and other Unicode symbols. The AI GUI render engine does not support TeX code. You must not use LaTeX in responses.`;
const DEFAULT_MODEL = "gpt-3.5-turbo";

export default async function cPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const chat = await getChat(params.id, userId!);

  return (
    <main className="min-h-screen">
      <div className="flex gap-2 p-8">
        <Title />
        <Changelog />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <div className="flex flex-col lg:flex-row justify-evenly">
        <Sidebar userId={userId} />
        <AI
          initialAIState={{
            chatId: params.id,
            chatAreaId: "left",
            messages: chat?.leftMessages ?? [],
            model: chat?.leftModel ?? DEFAULT_MODEL,
            system: chat?.leftSystemPrompt ?? DEFAULT_SYSTEM_PROMPT,
          }}
          initialUIState={[]}
        >
          <Chat id={params.id} initialModel={chat?.leftModel ?? DEFAULT_MODEL} initialSystem={chat?.leftSystemPrompt ?? DEFAULT_SYSTEM_PROMPT} />
        </AI>
        <AI
          initialAIState={{
            chatId: params.id,
            chatAreaId: "right",
            messages: chat?.rightMessages ?? [],
            model: chat?.rightModel ?? DEFAULT_MODEL,
            system: chat?.rightSystemPrompt ?? DEFAULT_SYSTEM_PROMPT,
          }}
          initialUIState={[]}
        >
          <Chat id={params.id} initialModel={chat?.rightModel ?? DEFAULT_MODEL} initialSystem={chat?.rightSystemPrompt ?? DEFAULT_SYSTEM_PROMPT} />
        </AI>
      </div>
    </main>
  );
}
