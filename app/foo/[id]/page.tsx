import FooChat from "../chat";
import { Changelog } from "@/components/changelog";
import { ModeToggle } from "@/components/mode-toggle";
import Title from "@/components/title";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AI } from "../../actions";

export default function FooPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  return (
    <main className="min-h-screen">
      <div className="flex gap-2 p-8">
        <Title />
        <Changelog />
        <ModeToggle />
        <div className="flex items-center px-4">{userId && <UserButton afterSignOutUrl="/sign-in" />}</div>
      </div>
      <div className="flex gap-16 justify-evenly">
        <AI initialAIState={[{ role: "user", content: "Hello left!" }]} initialUIState={[]}>
          <FooChat />
        </AI>
        <AI initialAIState={[{ role: "user", content: "Hello right!" }]} initialUIState={[]}>
          <FooChat />
        </AI>
      </div>
    </main>
  );
}
