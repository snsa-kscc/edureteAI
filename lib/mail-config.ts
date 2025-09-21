import nodemailer from "nodemailer";
import { EMAIL_TEMPLATES } from "@/lib/mail-content";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
};

const FROM_EMAIL = "edureteAI <app@edurete.com>";
const REPLY_TO_EMAIL = "podrska@edurete.com";

// Helper function to extract first name from full name
function getFirstName(fullName: string | null | undefined): string {
  if (!fullName) return "korisnik";

  const nameParts = fullName.trim().split(" ");
  return nameParts[0] || "korisnik";
}

// Create email transporter
function createTransporter() {
  return nodemailer.createTransport(EMAIL_CONFIG);
}

// Send welcome email (for new user registration)
export async function sendWelcomeEmail(user: any) {
  try {
    const transporter = createTransporter();
    const firstName = user.first_name || "korisnik";
    const email = user.email_addresses?.[0]?.email_address;

    if (!email) {
      console.error("No email address found for user:", user.id);
      return;
    }

    const template = EMAIL_TEMPLATES.WELCOME;
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: template.subject,
      html: template.getHtml(firstName),
      text: template.getText(firstName),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

// Send subscription welcome email (for new subscription)
export async function sendSubscriptionWelcomeEmail(userId: string, email: string | null, fullName: string | null | undefined, tier: string) {
  try {
    const transporter = createTransporter();

    if (!email) {
      console.error("No email address found for userId:", userId);
      return;
    }

    const template = EMAIL_TEMPLATES.SUBSCRIPTION_WELCOME;
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: template.subject(tier),
      html: template.getHtml(getFirstName(fullName), tier),
      text: template.getText(getFirstName(fullName), tier),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending subscription welcome email:", error);
  }
}

// Send upgrade email (for subscription tier upgrades from PAID to PAID_PLUS)
export async function sendUpgradeEmail(userId: string, email: string | null, fullName: string | null | undefined) {
  try {
    const transporter = createTransporter();

    if (!email) {
      console.error("No email address found for userId:", userId);
      return;
    }

    const template = EMAIL_TEMPLATES.UPGRADE;
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: template.subject(),
      html: template.getHtml(getFirstName(fullName)),
      text: template.getText(getFirstName(fullName)),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending upgrade email:", error);
  }
}
