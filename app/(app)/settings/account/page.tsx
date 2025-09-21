import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageUsageProgress } from "@/components/message-usage-progress";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserSubscriptionDetails } from "@/lib/subscription-actions";
import { SubscriptionManagement } from "@/components/subscription-management";
import { DeleteAccountSection } from "@/components/delete-account-section";
import { MESSAGE_TIER, SUBSCRIPTION_PLANS } from "@/lib/model-config";
import { PricingCardsSection } from "@/components/pricing-cards-section";

export default async function AccountPage() {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  // Try catch needed because it errors hard when deleting user.

  let user;

  try {
    user = await currentUser();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  const subscriptionDetails = await getUserSubscriptionDetails();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Molimo prijavi se da bi vidio postavke svog računa.</p>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Postavke računa</h1>
        <p className="text-muted-foreground">Upravljaj postavkama računa i pretplatom.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Korištenje</CardTitle>
            <CardDescription>Tvoje trenutno korištenje poruka i ograničenja.</CardDescription>
          </CardHeader>
          <CardContent>
            <MessageUsageProgress userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <CardDescription>
              {subscriptionDetails.isSubscribed
                ? `Trenutno koristiš ${SUBSCRIPTION_PLANS[subscriptionDetails.plan!]?.name || "besplatni plan"}.`
                : "Trenutno koristiš besplatni plan."}
              <br />
              {subscriptionDetails.pendingTier &&
                `U sljedećem razdoblju koristit ćeš ${SUBSCRIPTION_PLANS[subscriptionDetails.pendingTier]?.name || "besplatni"} plan.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium">{subscriptionDetails.isSubscribed ? SUBSCRIPTION_PLANS[subscriptionDetails.plan!].name : "Besplatni plan"}</span>
              </div>
              <div className="flex justify-between">
                <span>Ukupno poruka</span>
                <span className="font-medium">{subscriptionDetails.totalMessages}</span>
              </div>
              {subscriptionDetails.isSubscribed && subscriptionDetails.periodEnd && (
                <div className="flex justify-between">
                  {subscriptionDetails.cancelAtPeriodEnd ? (
                    <>
                      <span>Datum zatvaranja pretplate</span>
                      <span className="font-medium">{new Date(subscriptionDetails.periodEnd).toLocaleDateString("hr-HR")}</span>
                    </>
                  ) : (
                    <>
                      <span>Datum obnavljanja pretplate</span>
                      <span className="font-medium">{new Date(subscriptionDetails.periodEnd).toLocaleDateString("hr-HR")}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubscriptionManagement isSubscribed={subscriptionDetails.isSubscribed} />
          </CardFooter>
        </Card>
      </div>

      <Separator className="my-8" />

      {!subscriptionDetails.isSubscribed && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dostupni planovi pretplate</h2>
          <PricingCardsSection />
        </div>
      )}

      {subscriptionDetails.tier === MESSAGE_TIER.PAID_PLUS && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h2 className="text-xl font-semibold mb-6">Korištenjem ovog plana ostvaruješ pogodnost instrukcija s našim instruktorima 🥰🎉</h2>
          <p className="text-sm">
            Ne zaboravi se javiti na{" "}
            <span className="font-medium">
              <a href="mailto:podrska@edurete.com">podrska@edurete.com</a>
            </span>{" "}
            za dogovor.
          </p>
        </div>
      )}

      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold text-destructive mb-4">Opasna zona</h2>
        <Card className="border-destructive/20 hover:bg-red-300/10">
          <CardHeader>
            <CardTitle>Brisanje računa</CardTitle>
            <CardDescription>Trajno izbriši svoj račun i sve povezane podatke. Klikaj odgovorno jer poslije ovog nema natrag.</CardDescription>
          </CardHeader>
          <CardFooter>
            <DeleteAccountSection userId={userId} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
