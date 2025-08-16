import nodemailer from "nodemailer";
import path from "path";
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
const APP_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ai.edurete.com";

// Email templates configuration
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: "Dobrodošli u EdureteAI! 🎉",
    getHtml: (firstName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dobrodošli u EdureteAI! 🎉</title>

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
        </style>
    </head>

    <body style="max-width: 710px; margin: 0 auto;">
        <div style="position: relative;">
            <img style="width: 100%; display: block;" src="cid:hero-image">
            <div style="position: absolute; top: 30%; left: 10%;">
                <h1 style="color: #FFF; font-family: 'Inter', sans-serif;font-size: 23px; font-style: normal; font-weight: 600; line-height: 30px;">
                    Dobrodošli u <span style="background: linear-gradient(90deg, #155DFC 0%, #AD46FF 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">edureteAI</span>
                </h1>
            </div>

        </div>
        <div style="background: #EFF3FF; padding: 35px;">
            <p style="color: #0D1A28; font-family: 'Inter', sans-serif;font-size: 14px; font-style: normal; font-weight: 400; line-height: 18px; margin-top: 0;">Pozdrav ${firstName},</p>
            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif;font-size: 14px; font-style: normal; font-weight: 400; line-height: 18px; margin-top: 0;">
                Izuzetno nam je drago što ste nam se pridružili i postali dio naše rastuće zajednice. 
                Naša <strong>Edurete platforma</strong> osmišljena je kako bi <strong>pomogla da učenje postane lakše,
                    zabavnije i učinkovitije.</strong> Bilo da se pripremate za ispite, želite bolje razumjeti gradivo ili
                jednostavno proširiti svoje znanje, mi smo tu za Vas! 
                 </p>
            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif;font-size: 14px; font-style: normal; font-weight: 400; line-height: 18px;">
                Povezali smo <strong>najnaprednije AI alate s podrškom instruktora</strong> kako bismo stvorili okruženje
                prilagođeno Vašem tempu i potrebama - modernije, brže i pouzdanije.
                 </p>
            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif;font-size: 14px; font-style: normal; font-weight: 400; line-height: 18px;">
                Kako biste <strong>maksimalno iskoristili sve prednosti aplikacije,</strong> pogledajte naš
                <a style="color: #155DFC;" href="#" target="_blank" rel="noopener noreferrer">kratki video</a> sa savjetima
                za rad.

            </p>
        </div>

        <div>
            <h2 style="text-align: center; font-family: 'Inter', sans-serif; font-size: 27px;font-style: normal;font-weight: 700;line-height: normal;">
                <span style="background: linear-gradient(90deg, #155DFC 0%, #AD46FF 100%);background-clip: text;-webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tips&tricks</span>
            </h2>
        </div>

        <div style="display: flex; gap: 8px; margin-right: 15px; margin-left: 15px;">
            <div style="flex: 1; background-image: url(cid:background-top); background-color: #050E39; background-repeat: no-repeat; background-position: top right; padding: 25px 45px 15px 15px;">
                <img src="cid:image-1" alt="">
                <p style="color: #FFF; font-family: 'Inter', sans-serif; font-size: 13px; font-style: normal; font-weight: 400; line-height: 18px;">
                    <span style="font-weight: 700;">Korištenje dva prozora </span>
                    je korisno jer se može provjeriti rješenje, ali i produbiti razumijevanje gradiva.
                </p>
            </div>

            <div style="flex: 1; background-image: url(cid:background-top); background-color: #050E39; background-repeat: no-repeat; background-position: top right; padding: 25px 45px 15px 15px;">
                <img src="cid:image-2" alt="">
                <p style="color: #FFF; font-family: 'Inter', sans-serif; font-size: 13px; font-style: normal; font-weight: 400; line-height: 18px;">
                    <span style="font-weight: 700;">Isprobavanje različitih modela </span>
                    se isplati jer je svatko od nas jedinstven i ne odgovara svima isti način komunikacije.
                </p>
            </div>

            <div style="flex: 1; background-image: url(cid:background-top); background-color: #050E39; background-repeat: no-repeat; background-position: top right; padding: 25px 45px 15px 15px;">
                <img src="cid:image-3" alt="">
                <p style="color: #FFF; font-family: 'Inter', sans-serif; font-size: 13px; font-style: normal; font-weight: 400; line-height: 18px;">
                    <span style="font-weight: 700;">Prilagodi sebi prozor</span>
                    omogućuje da se modelu da općenita uputa koju će slijediti kroz cijeli razgovor.

                </p>
            </div>

        </div>

        <div style="background: #EFF3FF; padding: 20px 51px; margin-top: 22px;">
            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif; font-size: 14px; font-style: normal;font-weight: 400;line-height: 18px;">
                Ukoliko imate bilo <strong> kakvih pitanja ili trebate pomoć,</strong> naš tim Vam uvijek stoji na
                raspolaganju. Slobodno nam se obratite na mail <a href="mailto:podrska@edurete.com" style="color: #155DFC; font-weight: 600; text-decoration: none;"> podrska@edurete.com.</a></p>

            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif; font-size: 14px; font-style: normal;font-weight: 400;line-height: 18px;">
                Želimo Vam puno uspjeha i uživanja u učenju!</p>

            <p style="color: #0D1A28; text-align: center; font-family: 'Inter', sans-serif; font-size: 14px; font-style: normal;font-weight: 400;line-height: 18px;">
                Srdačan pozdrav,<br>
                <strong>Tim Edurete</strong>
            </p>
        </div>

        <div style="background: radial-gradient(200.98% 137.88% at 2.6% 36.82%, #021240 0%, #070A30 100%);">
            <div style="max-width: 260px;margin: 0 auto; padding-bottom: 25px; padding-top: 25px;">
                <p style="margin-bottom:10px; margin-top: 0; color: #FFF; text-align: center; font-family: 'Inter', sans-serif; font-size: 16px;font-style: normal;font-weight: 700;line-height: 18px;">
                    Edurete - mreža znanja</p>
                <div style="display: flex;justify-content: center;gap: 10px;">
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="cid:facebook-icon" alt=""></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="cid:insta-icon" alt=""></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="cid:yt-icon" alt=""></a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `,
    getText: (firstName: string) => `
    Dobrodošli u edureteAI

    Pozdrav ${firstName},

    Izuzetno nam je drago što ste nam se pridružili i postali dio naše rastuće zajednice. 
    Naša Edurete platforma osmišljena je kako bi pomogla da učenje postane lakše, zabavnije i učinkovitije. Bilo da se pripremate za ispite, želite bolje razumjeti gradivo ili jednostavno proširiti svoje znanje, mi smo tu za Vas!

    Povezali smo najnaprednije AI alate s podrškom instruktora kako bismo stvorili okruženje prilagođeno Vašem tempu i potrebama - modernije, brže i pouzdanije.

    Kako biste maksimalno iskoristili sve prednosti aplikacije, pogledajte naš kratki video sa savjetima za rad.

    Tips&tricks

    Korištenje dva prozora je korisno jer se može provjeriti rješenje, ali i produbiti razumijevanje gradiva.

    Isprobavanje različitih modela se isplati jer je svatko od nas jedinstven i ne odgovara svima isti način komunikacije.

    Prilagodi sebi prozor omogućuje da se modelu da općenita uputa koju će slijediti kroz cijeli razgovor.

    Ukoliko imate bilo kakvih pitanja ili trebate pomoć, naš tim Vam uvijek stoji na raspolaganju. Slobodno nam se obratite na mail podrska@edurete.com.

    Želimo Vam puno uspjeha i uživanja u učenju!

    Srdačan pozdrav,
    Tim Edurete

    Edurete - mreža znanja
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

// Helper function to create email attachments for images
function createEmailAttachments() {
  return [
    {
      filename: "edurete-hero-image.jpg",
      path: path.join(process.cwd(), "public/email-assets/edurete-hero-image.jpg"),
      cid: "hero-image",
    },
    {
      filename: "background-top.png",
      path: path.join(process.cwd(), "public/email-assets/background-top.png"),
      cid: "background-top",
    },
    {
      filename: "image-1.png",
      path: path.join(process.cwd(), "public/email-assets/image-1.png"),
      cid: "image-1",
    },
    {
      filename: "image-2.png",
      path: path.join(process.cwd(), "public/email-assets/image-2.png"),
      cid: "image-2",
    },
    {
      filename: "image-3.png",
      path: path.join(process.cwd(), "public/email-assets/image-3.png"),
      cid: "image-3",
    },
    {
      filename: "facebook-icon.png",
      path: path.join(process.cwd(), "public/email-assets/facebook-icon.png"),
      cid: "facebook-icon",
    },
    {
      filename: "insta-icon.png",
      path: path.join(process.cwd(), "public/email-assets/insta-icon.png"),
      cid: "insta-icon",
    },
    {
      filename: "yt-icon.png",
      path: path.join(process.cwd(), "public/email-assets/yt-icon.png"),
      cid: "yt-icon",
    },
  ];
}

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
    const email = user.email_addresses?.[0]?.email_address || "podrska@edurete.com";

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
      attachments: createEmailAttachments(),
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
