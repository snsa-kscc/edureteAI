"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { createCheckoutSession } from "@/lib/subscription-actions";
import { SUBSCRIPTION_PLANS, MESSAGE_TIER } from "@/lib/model-config";
import { cn } from "@/lib/utils";
import { PricingCard } from "@/components/pricing-card";

type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

interface StripeCheckoutDrawerProps {
  children: React.ReactNode;
  className?: string;
}

export function StripeCheckoutDrawer({ children, className }: StripeCheckoutDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

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
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[100vh] data-[vaul-drawer-direction=bottom]:mt-0">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl font-bold">Odaberi svoj plan</DrawerTitle>
            <DrawerDescription className="text-center">Nadogradi za otključavanje premium značajki i povećanje limita poruka.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <PricingCard tier={MESSAGE_TIER.PAID} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID} onSelectPlan={handleSelectPlan} />
            <PricingCard tier={MESSAGE_TIER.PAID_PLUS} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID_PLUS} onSelectPlan={handleSelectPlan} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Odustani</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
