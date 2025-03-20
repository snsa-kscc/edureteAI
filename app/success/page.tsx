import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Thank you for your subscription!</h1>
      <p className="text-muted-foreground">You can manage your subscription in the dashboard.</p>
      <Link href="/">
        <Button className="mt-4">Go back to home</Button>
      </Link>
    </div>
  );
}
