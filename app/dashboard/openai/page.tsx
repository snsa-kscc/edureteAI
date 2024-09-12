import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { getUserData, getUserQuota, updateUserLimit } from "@/lib/actions";
import { tokensToDollars } from "@/lib/utils";

const MODEL = "gpt";

// { id: 1, email: "sinisa@dvasadva.com", tokens: 1034, amount: 0.0002, limit: 5 },
// { id: 2, email: "sinisa@dvasadva.hr", tokens: 2359, amount: 0.0002, limit: 5 },
// { id: 3, email: "test@example.com", tokens: 3455, amount: 0.0003, limit: 5 },
// { id: 4, email: "test2@example.com", tokens: 94, amount: 0.0001, limit: 5 },

export default async function AppDashboardOpenaiPage() {
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
      <h1 className="text-2xl font-bold mb-4">OpenAI API Usage Dashboard</h1>
      <Navigation />
      <Dashboard initialUsers={users} model={MODEL} updateUserLimit={updateUserLimit} />
    </div>
  );
}
