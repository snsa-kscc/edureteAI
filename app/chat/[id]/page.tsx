import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ModeToggle } from "@/components/mode-toggle";
import { Changelog } from "@/components/changelog";

import Chat from "@/components/chat";
import Title from "@/components/title";
import Sidebar from "@/components/sidebar";

export default function ChatPage() {
  const { userId } = auth();

  return (
    <main className="min-h-screen">
      <div className="flex gap-2 p-8">
        <Title />
        <Changelog />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <div className="flex flex-col md:flex-row mx-4">
        <Sidebar />
        <Chat />
        <Chat />
      </div>
    </main>
  );
}
