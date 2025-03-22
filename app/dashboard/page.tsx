import { Navigation } from "@/components/navigation";
import DashboardLayout from "@/components/layouts/dashboard.tsx";

export default function NavigationPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 my-20">
        <h1 className="text-2xl font-bold mb-4">API Usage Dashboard</h1>
        <Navigation />
      </div>
    </DashboardLayout>
  );
}
