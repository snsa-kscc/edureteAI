"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { StripeCheckoutDrawer } from "@/components/stripe-checkout-drawer";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps extends ButtonProps {
  showIcon?: boolean;
  label?: string;
}

export function SubscriptionButton({ className, variant = "default", size = "lg", showIcon = true, label = "Nadogradi", ...props }: SubscriptionButtonProps) {
  return (
    <StripeCheckoutDrawer>
      <Button
        variant="outline"
        size={size}
        className={cn(
          "font-medium w-full border-purple-500 text-white dark:text-purple-500 bg-gradient-to-b from-purple-500 to-purple-300 dark:from-purple-500/30 dark:to-transparent hover:text-gray-200 dark:hover:text-gray-300 transition-all",
          className
        )}
        {...props}
      >
        {showIcon && <CreditCard className="mr-2 h-4 w-4" />}
        {label}
      </Button>
    </StripeCheckoutDrawer>
  );
}
