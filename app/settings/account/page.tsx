import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function AccountPage() {
  const { sessionClaims } = await auth();

  return (
    <div>
      Stranica za account
      {sessionClaims?.membership && Object.keys(sessionClaims.membership).length > 0 && (
        <Button variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      )}
    </div>
  );
}
