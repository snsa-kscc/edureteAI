import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-8">edureteAI</h1>
      <div className="flex flex-row gap-4">
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton>
          <Button>Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
