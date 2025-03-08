import { auth } from "@clerk/nextjs/server";
import { saveReferral } from "@/lib/neon-actions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;
  const { searchParams } = new URL(req.url);
  const referrerId = searchParams.get("ref");

  if (userId && referrerId) {
    try {
      await saveReferral(referrerId, userId);
      return NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
      console.error("Error saving referral:", error);
    }
  }
  return NextResponse.redirect(new URL("/", req.url));
}
