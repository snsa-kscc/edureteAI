import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp path="/sign-up" />
    </div>
  );
}
