import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { getUsersData } from "@/lib/redis-actions";
import { updateUserLimit } from "@/lib/neon-actions";
import { getUsersUsage } from "@/lib/utils";

const MODEL_FAMILY = "openai";
export const dynamic = "force-dynamic";

export default async function AppDashboardOpenaiPage() {
  const usersData = await getUsersData();

  const users = await getUsersUsage(usersData, MODEL_FAMILY);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI API Usage Dashboard</h1>
      <Navigation />
      <Dashboard initialUsers={users} modelFamily={MODEL_FAMILY} updateUserLimit={updateUserLimit} />
    </div>
  );
}
