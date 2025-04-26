"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS, MESSAGE_TIER } from "@/lib/model-config";

type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

interface PricingCardProps {
  tier: SubscriptionTier;
  isLoading: boolean;
  onSelectPlan: (plan: SubscriptionTier) => void;
}

export const PricingCard = ({ tier, isLoading, onSelectPlan }: PricingCardProps) => {
  const plan = SUBSCRIPTION_PLANS[tier];

  return (
    <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-5xl font-bold">{plan.price}</span>
            <span className="text-sm text-muted-foreground">€/mj</span>
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
        <div className="hidden md:block space-y-2">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{plan.totalMessages.toLocaleString()} poruka mjesečno</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Odabrani snimci za lakše učenje</span>
            </li>
            {tier === MESSAGE_TIER.PAID_PLUS && (
              <>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Prioritetna podrška naših instruktora</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>4x30 minuta svaki mjesec sa instruktorom</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="pt-6">
        <Button className="w-full" onClick={() => onSelectPlan(tier)} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Obrađujem...
            </>
          ) : (
            <>Pretplati se</>
          )}
        </Button>
      </div>
    </div>
  );
};
