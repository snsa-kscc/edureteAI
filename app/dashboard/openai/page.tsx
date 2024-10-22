import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { getUsersData, updateUserLimit } from "@/lib/redis-actions";
import { getUsersUsage } from "@/lib/utils";

const MODEL = "gpt";
export const dynamic = "force-dynamic";

export default async function AppDashboardOpenaiPage() {
  const usersData = await getUsersData();

  const users = await getUsersUsage(usersData, MODEL);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI API Usage Dashboard</h1>
      <Navigation />
      <Dashboard initialUsers={users} model={MODEL} updateUserLimit={updateUserLimit} />
    </div>
  );
}
