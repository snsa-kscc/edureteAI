import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/components/dashboard";
import { getUsersData, updateUserLimit } from "@/lib/redis-actions";
import { getUsersUsage } from "@/lib/utils";

const MODEL = "claude";

export default async function AppDashboardAnthropicPage() {
  const usersData = await getUsersData();

  usersData.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const users = await getUsersUsage(usersData, MODEL);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anthropic API Usage Dashboard</h1>
      <Navigation />
      <Dashboard initialUsers={users} model={MODEL} updateUserLimit={updateUserLimit} />
    </div>
  );
}
