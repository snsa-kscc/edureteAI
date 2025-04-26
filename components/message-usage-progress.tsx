"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getUserMessageCounts } from "@/lib/message-limits";
import { getUserMessageLimits } from "@/lib/subscription-utils";
import { MESSAGE_TIER, SUBSCRIPTION_PLANS } from "@/lib/model-config";

interface MessageUsageProgressProps {
  userId: string;
}

export function MessageUsageProgress({ userId }: MessageUsageProgressProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState({
    totalMessages: 0,
    premiumModelMessages: 0,
    totalLimit: 0,
    premiumLimit: 0,
    subscriptionTier: MESSAGE_TIER.FREE,
  });

  useEffect(() => {
    async function loadUsage() {
      try {
        setIsLoading(true);
        const counts = await getUserMessageCounts(userId);
        const limits = await getUserMessageLimits(userId);

        setUsage({
          totalMessages: counts.totalMessages,
          premiumModelMessages: counts.premiumModelMessages,
          totalLimit: limits.totalMessages,
          premiumLimit: limits.premiumModelMessages,
          subscriptionTier: counts.subscriptionTier,
        });
      } catch (error) {
        console.error("Failed to load message usage:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      loadUsage();
    }
  }, [userId]);

  const totalPercentage = Math.min(Math.round((usage.totalMessages / usage.totalLimit) * 100), 100);

  const premiumPercentage = Math.min(Math.round((usage.premiumModelMessages / usage.premiumLimit) * 100), 100);

  const isPaid = usage.subscriptionTier !== MESSAGE_TIER.FREE;

  if (isLoading) {
    return (
      <div className="p-4 space-y-2 animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Ukupno poruke</span>
          <span className="font-medium">
            {usage.totalMessages}/{usage.totalLimit}
          </span>
        </div>
        <Progress value={totalPercentage} className="h-2" />
      </div>

      {/* {isPaid && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Premium poruke</span>
            <span className="font-medium">
              {usage.premiumModelMessages}/{usage.premiumLimit}
            </span>
          </div>
          <Progress value={premiumPercentage} className="h-2" />
        </div>
      )} */}

      <div className="text-xs text-muted-foreground">
        {usage.subscriptionTier === MESSAGE_TIER.FREE ? (
          <span>Besplatni plan • {usage.totalLimit - usage.totalMessages} poruka ostalo</span>
        ) : (
          <span>
            {usage.subscriptionTier === MESSAGE_TIER.PAID ? SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID].name : SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS].name}
          </span>
        )}
      </div>
    </div>
  );
}
