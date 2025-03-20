"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { createCheckoutSession } from "@/lib/subscription-actions";
import { SUBSCRIPTION_PLANS, MESSAGE_TIER } from "@/lib/model-config";
import { cn } from "@/lib/utils";

type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

interface PricingCardProps {
  tier: SubscriptionTier;
  isLoading: boolean;
  onSelectPlan: (plan: SubscriptionTier) => void;
}

const PricingCard = ({ tier, isLoading, onSelectPlan }: PricingCardProps) => {
  const plan = SUBSCRIPTION_PLANS[tier];

  return (
    <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
        <div className="space-y-2">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{plan.totalMessages.toLocaleString()} messages per month</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{plan.premiumModelMessages.toLocaleString()} premium model messages</span>
            </li>
            {tier === MESSAGE_TIER.PAID_PLUS && (
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority support our sassy instructors and instructoressess</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="pt-6">
        <Button className="w-full" onClick={() => onSelectPlan(tier)} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Subscribe</>
          )}
        </Button>
      </div>
    </div>
  );
};

interface StripeCheckoutDrawerProps {
  children: React.ReactNode;
  className?: string;
}

export function StripeCheckoutDrawer({ children, className }: StripeCheckoutDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const router = useRouter();

  const handleSelectPlan = async (plan: SubscriptionTier) => {
    try {
      setIsLoading(true);
      setSelectedTier(plan);

      // Get the current URL to use as the return URL
      const returnUrl = window.location.origin;

      // Create a checkout session and redirect to Stripe
      const { url } = await createCheckoutSession(plan, returnUrl);

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className={cn("cursor-pointer", className)}>{children}</div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl font-bold">Choose Your Plan</DrawerTitle>
            <DrawerDescription className="text-center">Upgrade to unlock premium features and increase your message limits.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <PricingCard tier={MESSAGE_TIER.PAID} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID} onSelectPlan={handleSelectPlan} />
            <PricingCard tier={MESSAGE_TIER.PAID_PLUS} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID_PLUS} onSelectPlan={handleSelectPlan} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
