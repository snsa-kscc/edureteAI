import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/components/dashboard";
import { getUserData, getUserQuota, updateUserLimit } from "@/lib/actions";
import { tokensToDollars } from "@/lib/utils";

const MODEL = "claude";

export default async function AppDashboardAnthropicPage() {
  const usersData = await getUserData();

  const users = await Promise.all(
    Object.entries(usersData).map(async ([userId, email]) => {
      const { totalTokensUsed, quotaLimit } = await getUserQuota(userId, MODEL);
      return {
        userId,
        email,
        tokens: totalTokensUsed,
        amount: tokensToDollars(totalTokensUsed),
        limit: tokensToDollars(quotaLimit),
      };
    })
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anthropic API Usage Dashboard</h1>
      <Navigation />
      <Dashboard initialUsers={users} model={MODEL} updateUserLimit={updateUserLimit} />
    </div>
  );
}
