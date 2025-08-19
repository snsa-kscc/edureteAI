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

    <body style="margin:0; padding:0; background-color:#ffffff; font-family: Arial, sans-serif; max-width:710px;">

        <!-- HERO -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td align="center" style="position:relative;">
                    <img src="cid:news-1" alt="EdureteAI dobrodošlica" style="width:100%; max-width:710px; display:block;">
                </td>
            </tr>
        </table>

        <!-- TEXT BLOCK -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#EFF3FF; padding:35px;">
            <tr>
                <td align="left" style="font-size:14px; color:#0D1A28;">
                    Pozdrav ${firstName},
                </td>
            </tr>
            <tr><td height="15"></td></tr>
            <tr>
                <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                    Izuzetno nam je drago što ste nam se pridružili i postali dio naše rastuće zajednice. 
                    Naša <strong>Edurete platforma</strong> osmišljena je kako bi <strong>pomogla da učenje postane lakše,
                    zabavnije i učinkovitije.</strong>
                </td>
            </tr>
            <tr><td height="10"></td></tr>
            <tr>
                <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                    Povezali smo <strong>najnaprednije AI alate s podrškom instruktora</strong> kako bismo stvorili okruženje
                    prilagođeno Vašem tempu i potrebama.
                </td>
            </tr>
            <tr><td height="10"></td></tr>
            <tr>
                <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                    Kako biste <strong>maksimalno iskoristili sve prednosti aplikacije,</strong> pogledajte naš 
                    <a href="#" target="_blank" style="color:#155DFC;">kratki video</a>.
                </td>
            </tr>
        </table>

        <!-- TIPS TITLE -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px;">
            <tr>
                <td align="center" style="font-size:27px; font-weight:700; padding:20px 0;">
                    <span style="color:#155DFC;">Tips & tricks</span>
                </td>
            </tr>
        </table>

      <!-- TIPS GRID (3 kolone s razmakom) -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px;">
      <tr>
        <!-- Tip 1 -->
        <td width="33%" valign="top" style="background-color:#050E39; padding:20px; color:#FFF; background-image: url(cid:background-top); background-repeat:no-repeat; background-position:top right;">
          <img src="cid:image-1" alt="Ikona za korištenje dva prozora" style="display:block; margin-bottom:10px;">
          <p style="font-size:13px; line-height:18px; margin:0;">
            <strong>Korištenje dva prozora</strong> je korisno jer se može provjeriti rješenje, ali i produbiti razumijevanje gradiva.
          </p>
        </td>

        <!-- Spacer -->
        <td width="8" style="font-size:0; line-height:0;">&nbsp;</td>

        <!-- Tip 2 -->
        <td width="33%" valign="top" style="background-color:#050E39; padding:20px; color:#FFF; background-image: url(cid:background-top); background-repeat:no-repeat; background-position:top right;"" >
          <img src="cid:image-2" alt="Ikona za isprobavanje različitih modela" style="display:block; margin-bottom:10px;">
          <p style="font-size:13px; line-height:18px; margin:0;">
            <strong>Isprobavanje različitih modela</strong> se isplati jer je svatko od nas jedinstven.
          </p>
        </td>

        <!-- Spacer -->
        <td width="8" style="font-size:0; line-height:0;">&nbsp;</td>

        <!-- Tip 3 -->
        <td width="33%" valign="top" style="background-color:#050E39; padding:20px; color:#FFF; background-image: url(cid:background-top); background-repeat:no-repeat; background-position:top right;"">
          <img src="cid:image-3" alt="Ikona za prilagođavanje prozora" style="display:block; margin-bottom:10px;">
          <p style="font-size:13px; line-height:18px; margin:0;">
            <strong>Prilagodi sebi prozor</strong> omogućuje da se modelu da uputa koju će slijediti kroz cijeli razgovor.
          </p>
        </td>
      </tr>
    </table>

        <!-- FOOTER -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#EFF3FF; padding:20px;">
            <tr>
                <td align="center" style="font-size:14px; color:#0D1A28; line-height:18px;">
                    Ukoliko imate bilo <strong>kakvih pitanja ili trebate pomoć</strong>, javite se na 
                    <a href="mailto:podrska@edurete.com" style="color:#155DFC; font-weight:600; text-decoration:none;">podrska@edurete.com</a>.
                </td>
            </tr>
            <tr><td height="10"></td></tr>
            <tr>
                <td align="center" style="font-size:14px; color:#0D1A28;">
                    Želimo Vam puno uspjeha i uživanja u učenju!<br><br>
                    Srdačan pozdrav,<br>
                    <strong>Tim Edurete</strong>
                </td>
            </tr>
        </table>

        <!-- SOCIAL FOOTER -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#021240;">
            <tr>
                <td align="center" style="padding:20px; color:#FFF; font-size:16px; font-weight:700;">
                    Edurete - mreža znanja
                </td>
            </tr>
            <tr>
                <td align="center" style="padding-bottom:20px;">
                    <a href="https://www.facebook.com/edurete/?locale=hr_HR"><img src="cid:facebook-icon" alt="Facebook" style="margin:0 5px;"></a>
                    <a href="https://www.instagram.com/edurete_mreza/"><img src="cid:insta-icon" alt="Instagram" style="margin:0 5px;"></a>
                    <a href="https://www.youtube.com/@eduretemrezaznanja8067"><img src="cid:yt-icon" alt="YouTube" style="margin:0 5px;"></a>
                </td>
            </tr>

        </table>

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
      filename: "background-top.png",
      path: path.join(process.cwd(), "public/email-assets/background-top.png"),
      cid: "background-top",
    },
    {
      filename: "news-1.jpg",
      path: path.join(process.cwd(), "public/email-assets/news-1.jpg"),
      cid: "news-1",
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
    const email = user.email_addresses?.[0]?.email_address || "eklektik909@gmail.com";

    if (!email) {
      console.error("No email address found for user:", user.id);
      return;
    }

    const template = EMAIL_TEMPLATES.WELCOME;
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      replyTo: "podrska@edurete.com",
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
      replyTo: "podrska@edurete.com",
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
      replyTo: "podrska@edurete.com",
      subject: template.subject(),
      html: template.getHtml(getFirstName(fullName)),
      text: template.getText(getFirstName(fullName)),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending upgrade email:", error);
  }
}
