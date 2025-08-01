import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/lib/mail-config";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

async function verifyClerkWebhook(req: NextRequest, rawBody: Buffer) {
  const headerPayload = await headers();

  // Clerk uses Svix for webhook delivery, so we need Svix headers
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return false;
  }

  // Create the signed payload string that Svix uses
  const signedPayload = `${svixId}.${svixTimestamp}.${rawBody.toString()}`;

  // Generate the expected signature using base64
  const expectedSignature = crypto
    .createHmac("sha256", Buffer.from(CLERK_WEBHOOK_SECRET.split("_")[1], "base64"))
    .update(signedPayload)
    .digest("base64");

  // Svix signature comes in format "v1,signature1 v1,signature2"
  const signatures = svixSignature.split(" ");

  // Check if any of the signatures match
  for (const sig of signatures) {
    const [version, signature] = sig.split(",");
    if (version === "v1" && signature === expectedSignature) {
      return true;
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  const isValid = await verifyClerkWebhook(req, bodyBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const { type, data } = JSON.parse(bodyBuffer.toString());

  if (type === "user.created") {
    const user = data;
    await sendWelcomeEmail(user);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ status: "ignored" });
}
