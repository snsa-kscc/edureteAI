import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Hvala na pretplati!</h1>
      <p className="text-muted-foreground">Možete upravljati svojom pretplatom u postavkama.</p>
      <Link href="/">
        <Button className="mt-4 cursor-pointer">Povratak na početnu stranicu</Button>
      </Link>
    </div>
  );
}
