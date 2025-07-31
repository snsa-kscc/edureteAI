import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

// Function to send welcome email
const sendWelcomeEmail = async (user: any) => {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    // Extract user information
    const firstName = user.first_name || "there";
    const email = user.email_addresses?.[0]?.email_address;

    if (!email) {
      console.error("No email address found for user:", user.id);
      return;
    }

    // Email content in Croatian
    const mailOptions = {
      from: process.env.FROM_EMAIL || "app@edurete.com",
      to: email,
      subject: "Dobrodošli u EdureteAI! 🎉", // Welcome to EdureteAI in Croatian
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Dobrodošli u EdureteAI!</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">Pozdrav ${firstName},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Dobrodošli u EdureteAI platformu! Uzbuđeni smo što ste se pridružili našoj zajednici.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Što možete očekivati:</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Pristup naprednim AI alatima za učenje</li>
              <li>Personalizirane preporuke sadržaja</li>
              <li>Interaktivne lekcije i kvizove</li>
              <li>Praćenje napretka u realnom vremenu</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Ako imate bilo kakvih pitanja ili trebate pomoć, slobodno nas kontaktirajte.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://edurete.com"}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Počnite s učenjem
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Srdačno,<br>
            EdureteAI tim
          </p>
        </div>
      `,
      text: `
        Pozdrav ${firstName},
        
        Dobrodošli u EdureteAI platformu! Uzbuđeni smo što ste se pridružili našoj zajednici.
        
        Što možete očekivati:
        - Pristup naprednim AI alatima za učenje
        - Personalizirane preporuke sadržaja
        - Interaktivne lekcije i kvizove
        - Praćenje napretka u realnom vremenu
        
        Ako imate bilo kakvih pitanja ili trebate pomoć, slobodno nas kontaktirajte.
        
        Srdačno,
        EdureteAI tim
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error to avoid webhook retry issues
  }
};

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
