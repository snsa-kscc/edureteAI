import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { getUserData, getUserQuota, updateUserLimit } from "@/lib/actions";
import { tokensToDollars } from "@/lib/utils";

const MODEL = "gpt";

export default async function AppDashboardOpenaiPage() {
  const usersData = await getUserData();

  const users = await Promise.all(
    usersData.map(async ({ userId, firstName, lastName, emailAddress }) => {
      const { totalTokensUsed, quotaLimit } = await getUserQuota(userId, MODEL);
      return {
        userId,
        firstName,
        lastName,
        emailAddress,
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
