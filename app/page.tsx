import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ModeToggle } from "@/components/mode-toggle";

import Chat from "@/components/chat";
import Title from "@/components/title";

export default function Home() {
  const { userId } = auth();

  return (
    <main className="min-h-screen">
      <div className="flex p-8">
        <Title />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row">
        <Chat />
        <Chat />
      </div>
    </main>
  );
}
