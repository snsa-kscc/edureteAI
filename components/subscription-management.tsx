"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, createPortalSession } from "@/lib/subscription-actions";
import { MESSAGE_TIER } from "@/lib/model-config";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubscriptionManagementProps {
  isSubscribed: boolean;
}

export function SubscriptionManagement({ isSubscribed }: SubscriptionManagementProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubscribe = async (plan: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createCheckoutSession(plan as keyof typeof MESSAGE_TIER, window.location.origin + "/settings/account");

      if (result?.url) {
        window.location.href = result.url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError("An error occurred while trying to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createPortalSession(window.location.origin + "/settings/account");

      if (result?.url) {
        window.location.href = result.url;
      } else {
        setError("Failed to access subscription portal");
      }
    } catch (error) {
      console.error("Error accessing subscription portal:", error);
      setError("An error occurred while trying to manage your subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleManageSubscription} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Manage Subscription"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Upgrade to Premium</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a Plan</DialogTitle>
            <DialogDescription>Select a subscription plan to enhance your experience.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border p-4 hover:bg-accent cursor-pointer" onClick={() => handleSubscribe("paid")}>
              <h3 className="font-medium">EdureteAI Premium</h3>
              <p className="text-sm text-muted-foreground">1,500 total messages and 500 premium model messages per month</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-accent cursor-pointer" onClick={() => handleSubscribe("paid_plus")}>
              <h3 className="font-medium">EdureteAI Premium Plus</h3>
              <p className="text-sm text-muted-foreground">1,500 total messages and 500 premium model messages per month with additional features</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
