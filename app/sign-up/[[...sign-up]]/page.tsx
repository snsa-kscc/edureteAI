import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp path="/sign-up" />
    </div>
  );
}
