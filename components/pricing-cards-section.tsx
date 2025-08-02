"use client";

import React, { useState } from "react";
import { PricingCard } from "@/components/pricing-card";
import { MESSAGE_TIER, SUBSCRIPTION_PLANS } from "@/lib/model-config";
import { createCheckoutSession } from "@/lib/subscription-actions";
import { completeOnboarding } from "@/lib/onboarding";

type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

export function PricingCardsSection({ onboarding = false }: { onboarding?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  const handleSelectPlan = async (plan: SubscriptionTier) => {
    try {
      setIsLoading(true);
      setSelectedTier(plan);

      // If onboarding is true, complete onboarding first
      if (onboarding) {
        await completeOnboarding();
      }

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
    <div className="grid gap-8 md:grid-cols-2">
      <PricingCard tier={MESSAGE_TIER.PAID} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID} onSelectPlan={handleSelectPlan} />
      <PricingCard tier={MESSAGE_TIER.PAID_PLUS} isLoading={isLoading && selectedTier === MESSAGE_TIER.PAID_PLUS} onSelectPlan={handleSelectPlan} />
    </div>
  );
}
