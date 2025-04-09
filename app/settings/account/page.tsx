import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageUsageProgress } from "@/components/message-usage-progress";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionDetails } from "@/lib/subscription-actions";
import { SubscriptionManagement } from "@/components/subscription-management";
import { DeleteAccountSection } from "@/components/delete-account-section";

export default async function AccountPage() {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const subscriptionDetails = await getUserSubscriptionDetails();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Molimo prijavi se da bi vidio postavke svog računa.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl space-y-8">
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
            <CardTitle>Pretplata</CardTitle>
            <CardDescription>
              {subscriptionDetails.isSubscribed ? `Trenutno si na ${subscriptionDetails.plan} planu.` : "Trenutno si na besplatnom planu."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium">{subscriptionDetails.isSubscribed ? subscriptionDetails.plan : "Besplatno"}</span>
              </div>
              <div className="flex justify-between">
                <span>Ukupno poruka</span>
                <span className="font-medium">{subscriptionDetails.totalMessages}</span>
              </div>
              <div className="flex justify-between">
                <span>Premium poruke</span>
                <span className="font-medium">{subscriptionDetails.premiumModelMessages}</span>
              </div>
              {subscriptionDetails.isSubscribed && subscriptionDetails.periodEnd && (
                <div className="flex justify-between">
                  <span>Obnavljanje</span>
                  <span className="font-medium">{new Date(subscriptionDetails.periodEnd).toLocaleDateString()}</span>
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

      <div>
        <h2 className="text-xl font-semibold text-destructive mb-4">Opasna zona</h2>
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle>Brisanje računa</CardTitle>
            <CardDescription>Trajno izbriši svoj račun i sve povezane podatke. Ova radnja se ne može poništiti.</CardDescription>
          </CardHeader>
          <CardFooter>
            <DeleteAccountSection userId={userId} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
