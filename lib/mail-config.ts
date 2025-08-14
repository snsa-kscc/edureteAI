import nodemailer from "nodemailer";
import { MESSAGE_TIER, SUBSCRIPTION_PLANS } from "@/lib/model-config";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
};

const FROM_EMAIL = "edureteAI <app@edurete.com>";
const APP_URL = "https://ai.edurete.com";

// Email templates configuration
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: "Dobrodošli u EdureteAI! 🎉",
    getHtml: (firstName: string) => `
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
          <a href="${APP_URL}" 
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
    getText: (firstName: string) => `
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
  },

  SUBSCRIPTION_WELCOME: {
    subject: (tier: string) => `Dobrodošli u ${SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || "Premium"} plan! 🚀`,
    getHtml: (firstName: string, tier: string) => {
      const planName = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || "Premium";
      const features =
        tier === MESSAGE_TIER.PAID_PLUS
          ? [
              "Neograničene poruke s naprednim AI modelima",
              "Prioritetna podrška",
              "Pristup najnovijim značajkama",
              "Napredni alati za analizu",
              "Ekskluzivni sadržaj i resursi",
            ]
          : ["Povećan broj poruka", "Pristup premium AI modelima", "Napredne značajke platforme", "Prioritetna podrška"];

      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Dobrodošli u ${planName} plan! 🚀</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">Pozdrav ${firstName},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Hvala vam što ste se pretplatili na naš ${planName} plan! Sada imate pristup svim premium značajkama EdureteAI platforme.
          </p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="color: #1f2937; margin-top: 0;">Vaše ${planName} prednosti:</h3>
            <ul style="color: #374151; line-height: 1.6;">
              ${features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Možete odmah početi koristiti sve premium značajke. Ako trebate pomoć ili imate pitanja, naš tim je tu za vas.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Počnite koristiti ${planName}
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Hvala što ste dio EdureteAI zajednice!<br>
            EdureteAI tim
          </p>
        </div>
      `;
    },
    getText: (firstName: string, tier: string) => {
      const planName = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || "Premium";
      const features =
        tier === MESSAGE_TIER.PAID_PLUS
          ? [
              "Neograničene poruke s naprednim AI modelima",
              "Prioritetna podrška",
              "Pristup najnovijim značajkama",
              "Napredni alati za analizu",
              "Ekskluzivni sadržaj i resursi",
            ]
          : ["Povećan broj poruka", "Pristup premium AI modelima", "Napredne značajke platforme", "Prioritetna podrška"];

      return `
        Pozdrav ${firstName},
        
        Hvala vam što ste se pretplatili na naš ${planName} plan! Sada imate pristup svim premium značajkama EdureteAI platforme.
        
        Vaše ${planName} prednosti:
        ${features.map((feature) => `- ${feature}`).join("\n        ")}
        
        Možete odmah početi koristiti sve premium značajke. Ako trebate pomoć ili imate pitanja, naš tim je tu za vas.
        
        Hvala što ste dio EdureteAI zajednice!
        EdureteAI tim
      `;
    },
  },

  UPGRADE: {
    subject: () => `Uspješno nadograđeno na ${SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"} plan! 🎉`,
    getHtml: (firstName: string) => {
      const newFeatures = [
        "Neograničene poruke s najnaprednijim AI modelima",
        "Prioritetna podrška s brzim odgovorom",
        "Rani pristup novim značajkama",
        "Napredni alati za duboku analizu",
        "Ekskluzivni edukacijski sadržaj",
      ];

      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a; text-align: center;">Čestitamo na nadogradnji! 🎉</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">Pozdrav ${firstName},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Uspješno ste nadogradili s ${SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID]?.name || "Basic"} na ${
        SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"
      } plan! Hvala vam na povjerenju u EdureteAI.
          </p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="color: #1f2937; margin-top: 0;">Nove značajke koje su vam sada dostupne:</h3>
            <ul style="color: #374151; line-height: 1.6;">
              ${newFeatures.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Sve nove značajke su odmah aktivne i spremne za korištenje. Istražite poboljšanja i otkrijte kako ${
              SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"
            } plan može unaprijediti vaše iskustvo učenja.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Istražite ${SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"} značajke
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Hvala što rastete s nama!<br>
            EdureteAI tim
          </p>
        </div>
      `;
    },
    getText: (firstName: string) => {
      const newFeatures = [
        "Neograničene poruke s najnaprednijim AI modelima",
        "Prioritetna podrška s brzim odgovorom",
        "Rani pristup novim značajkama",
        "Napredni alati za duboku analizu",
        "Ekskluzivni edukacijski sadržaj",
      ];

      return `
        Pozdrav ${firstName},
        
        Uspješno ste nadogradili s ${SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID]?.name || "Basic"} na ${
        SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"
      } plan! Hvala vam na povjerenju u EdureteAI.
        
        Nove značajke koje su vam sada dostupne:
        ${newFeatures.map((feature) => `- ${feature}`).join("\n        ")}
        
        Sve nove značajke su odmah aktivne i spremne za korištenje. Istražite poboljšanja i otkrijte kako ${
          SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"
        } plan može unaprijediti vaše iskustvo učenja.
        
        Hvala što rastete s nama!
        EdureteAI tim
      `;
    },
  },
};

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
      subject: template.subject(),
      html: template.getHtml(getFirstName(fullName)),
      text: template.getText(getFirstName(fullName)),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending upgrade email:", error);
  }
}
