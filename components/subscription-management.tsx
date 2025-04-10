"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createPortalSession } from "@/lib/subscription-actions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubscriptionManagementProps {
  isSubscribed: boolean;
}

export function SubscriptionManagement({ isSubscribed }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createPortalSession(window.location.origin + "/settings/account");

      if (result?.url) {
        window.location.href = result.url;
      } else {
        setError("Nije moguće pristupiti pretplatnom portalu");
      }
    } catch (error) {
      console.error("Error accessing subscription portal:", error);
      setError("Došlo je do greške prilikom upravljanja pretplatom. Molimo pokušajte ponovno.");
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
            <AlertTitle>Greška</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleManageSubscription} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Učitavanje...
            </>
          ) : (
            "Upravljaj pretplatom"
          )}
        </Button>
      </div>
    );
  }

  return null;
}
