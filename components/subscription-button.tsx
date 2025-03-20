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

export function SubscriptionButton({
  className,
  variant = "default",
  size = "default",
  showIcon = true,
  label = "Upgrade",
  ...props
}: SubscriptionButtonProps) {
  return (
    <StripeCheckoutDrawer>
      <Button
        variant={variant}
        size={size}
        className={cn("font-medium", className)}
        {...props}
      >
        {showIcon && <CreditCard className="mr-2 h-4 w-4" />}
        {label}
      </Button>
    </StripeCheckoutDrawer>
  );
}
