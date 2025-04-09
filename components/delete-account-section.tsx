"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteUserAccount } from "@/lib/user-actions";

interface DeleteAccountSectionProps {
  userId: string;
}

export function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmation !== "DELETE") {
      setError("Molimo upiši DELETE za potvrdu brisanja računa");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await deleteUserAccount(userId);

      // Redirect to home page after successful deletion
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Došlo je do pogreške prilikom brisanja vašeg računa. Molimo pokušaj ponovno.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Greška</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            Izbriši račun
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izbriši račun</DialogTitle>
            <DialogDescription>Ova radnja se ne može poništiti. Trajno će izbrisati tvoj račun i ukloniti tvoje podatke s naših servera.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Molimo upiši <span className="font-bold">DELETE</span> za potvrdu.
            </p>
            <Input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder="Upiši DELETE za potvrdu" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Odustani
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading || confirmation !== "DELETE"}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Brisanje...
                </>
              ) : (
                "Izbriši račun"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
