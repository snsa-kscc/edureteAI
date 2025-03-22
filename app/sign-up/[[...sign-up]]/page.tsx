import { SignUp } from "@clerk/nextjs";
import DashboardLayout from "@/components/layouts/dashboard.tsx";

export default function SignUpPage() {
  return (
    <DashboardLayout>
      <div className="flex h-screen w-screen items-center justify-center">
        <SignUp />
      </div>
    </DashboardLayout>
  );
}
