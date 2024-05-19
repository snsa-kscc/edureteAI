import { Changelog } from "@/components/changelog";
import { ModeToggle } from "@/components/mode-toggle";
import Title from "@/components/title";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AI, ServerMessage, getChat } from "../actions";

export default async function FooLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  const history: ServerMessage[] = await getChat();

  return (
    <main className="min-h-screen">
      <div className="flex gap-2 p-8">
        <Title />
        <Changelog />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <AI initialAIState={history} initialUIState={[]}>
        {children}
      </AI>
    </main>
  );
}
