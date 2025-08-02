import { PricingCardsSection } from "@/components/pricing-cards-section";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Title } from "@/components/title";
import { OnboardingCompleteButton } from "@/components/onboarding-complete-button";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto p-4 my-10">
      <div className="flex justify-between">
        <Title />
        <ModeToggle className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer border-0 hover:bg-transparent" />
      </div>
      <h2 className="text-xl font-semibold my-16 text-center">Dostupni planovi pretplate</h2>
      <PricingCardsSection onboarding={true} />
      <div className="flex flex-col items-center justify-center my-16 gap-4">
        <OnboardingCompleteButton />
      </div>
    </div>
  );
}
