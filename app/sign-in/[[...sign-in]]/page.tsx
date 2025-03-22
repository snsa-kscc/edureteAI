import { SignIn } from "@clerk/nextjs";
import DashboardLayout from "@/components/layouts/dashboard.tsx";

export default function SignInPage() {
  return (
    <DashboardLayout>
      <div className="flex h-screen w-screen items-center justify-center">
        <SignIn />
      </div>
    </DashboardLayout>
  );
}
