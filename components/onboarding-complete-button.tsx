"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/lib/onboarding";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function OnboardingCompleteButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding();
      toast.success("Dobrodošli u edureteAI!");
      
      // Redirect to a new conversation
      const uuid = uuidv4();
      router.push(`/c/${uuid}`);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Došlo je do greške. Molimo pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCompleteOnboarding}
      disabled={isLoading}
      size="lg"
      className="w-full max-w-md"
    >
      {isLoading ? "Učitavanje..." : "Nastavi s besplatnim planom"}
    </Button>
  );
}
