import { MESSAGE_TIER, SUBSCRIPTION_PLANS } from "@/lib/model-config";

const APP_URL = "https://ai.edurete.com";
const SHORT_VIDEO_URL = "https://www.youtube.com/watch?v=I-B-fK-JdFU";

// Base email template function
function createBaseEmailTemplate(heroImage: string, textBlockContent: string) {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>edureteAI</title>
</head>

<body style="margin:0; padding:0; background-color:#ffffff; font-family: Arial, sans-serif; max-width:710px;">

    <!-- HERO -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
        <tr>
            <td align="center" style="position:relative;">
                <img src="${APP_URL}/email-assets/${heroImage}" alt="edureteAI - Dobrodošlica" style="width:100%; max-width:710px; display:block;">
            </td>
        </tr>
    </table>

    <!-- TEXT BLOCK -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#EFF3FF; padding:35px;">
        ${textBlockContent}
    </table>

    <!-- TIPS TITLE -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px;">
        <tr>
            <td align="center" style="font-size:27px; font-weight:700; padding:20px 0;">
                <span style="color:#155DFC;">Tips & tricks</span>
            </td>
        </tr>
    </table>

    <!-- TIPS GRID (2 columns) -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px;">
        <tr>
            <!-- Tip 1 -->
            <td width="49%" valign="top" style="background-color:#050E39; padding:20px; color:#FFF; background-image: url(${APP_URL}/email-assets/background-top.png); background-repeat:no-repeat; background-position:top right;">
                <img src="${APP_URL}/email-assets/image-1.png" alt="Ikona za korištenje dva prozora" style="display:block; margin-bottom:10px;">
                <p style="font-size:13px; line-height:18px; margin:0;">
                    <strong>Korištenje dva prozora</strong> je korisno jer omogućuje rad s različitim modelima, a time i bolje razumijevanje gradiva.
                </p>
            </td>

            <!-- Spacer -->
            <td width="8" style="font-size:0; line-height:0;">&nbsp;</td>

            <!-- Tip 2 -->
            <td width="49%" valign="top" style="background-color:#050E39; padding:20px; color:#FFF; background-image: url(${APP_URL}/email-assets/background-top.png); background-repeat:no-repeat; background-position:top right;">
                <img src="${APP_URL}/email-assets/image-2.png" alt="Ikona za prilagođavanje prozora" style="display:block; margin-bottom:10px;">
                <p style="font-size:13px; line-height:18px; margin:0;">
                    <strong>Prilagodi sebi prozor</strong> omogućuje postavljanje općih smjernica koje model slijedi tijekom cijelog razgovora.
                </p>
            </td>
        </tr>
    </table>

    <!-- FOOTER -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#EFF3FF; padding:20px;">
        <tr>
            <td align="center" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Ukoliko imaš bilo <strong>kakvih pitanja ili trebaš pomoć</strong>, javi se na
                <a href="mailto:podrska@edurete.com" style="color:#155DFC; font-weight:600; text-decoration:none;">podrska@edurete.com</a>.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="center" style="font-size:14px; color:#0D1A28;">
                Želimo ti puno uspjeha i uživanja u učenju!<br><br>
                Srdačan pozdrav,<br>
                <strong>Tim edurete</strong>
            </td>
        </tr>
    </table>

    <!-- SOCIAL FOOTER -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:710px; background:#021240;">
        <tr>
            <td align="center" style="padding:20px; color:#FFF; font-size:16px; font-weight:700;">
                edurete - mreža znanja
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-bottom:20px;">
                <a href="https://www.facebook.com/edurete/?locale=hr_HR"><img src="${APP_URL}/email-assets/facebook-icon.png" alt="Facebook" style="margin:0 5px;"></a>
                <a href="https://www.instagram.com/edurete_mreza/"><img src="${APP_URL}/email-assets/insta-icon.png" alt="Instagram" style="margin:0 5px;"></a>
                <a href="https://www.youtube.com/@eduretemrezaznanja8067"><img src="${APP_URL}/email-assets/yt-icon.png" alt="YouTube" style="margin:0 5px;"></a>
            </td>
        </tr>
    </table>

</body>

</html>
  `;
}

// Email templates configuration
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: "Dobrodošli u edureteAI! 🎉",
    getHtml: (firstName: string) => {
      const textBlockContent = `
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px; padding-bottom:10px;">
                Pozdrav ${firstName},
            </td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Izuzetno nam je drago što si nam se pridružio/la i postao/la dio naše rastuće zajednice.
                Naša <strong>edurete platforma</strong> osmišljena je kako bi <strong>pomogla da učenje postane lakše,
                zabavnije i učinkovitije.</strong> Bilo da se pripremaš za ispite, želiš bolje razumjeti gradivo ili jednostavno
                proširiti svoje znanje, mi smo tu za tebe!
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Povezali smo <strong>najnaprednije AI alate s podrškom instruktora</strong> kako bismo stvorili okruženje
                prilagođeno tvom tempu i potrebama - modernije, brže i pouzdanije.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Kako bi <strong>maksimalno iskoristio/la sve prednosti aplikacije,</strong> pogledaj naš
                <a href="${SHORT_VIDEO_URL}" target="_blank" style="color:#155DFC;">kratki video</a> sa savjetima za rad.
                Kao dobrodošlicu pripremili smo tablicu s linkovima na <a href="https://docs.google.com/spreadsheets/d/1oRSbet1JXSh9yG7_FL6XgQXf6QK5gu2H/edit?usp=sharing&ouid=107754712315620356659&rtpof=true&sd=true" target="_blank" style="color:#155DFC;">dvije u potpunosti riješene državne mature (A i B razina)</a>. 
                Ne brini ako se još ne pripremaš za maturu – mislili smo i na tebe pa smo zadatke kategorizirali i prema temama srednjoškolskih udžbenika.

            </td>
        </tr>
      `;
      return createBaseEmailTemplate("hero-welcome.jpg", textBlockContent);
    },
    getText: (firstName: string) => `
Pozdrav ${firstName},

Izuzetno nam je drago što si nam se pridružio/la i postao/la dio naše rastuće zajednice. Naša edurete platforma osmišljena je kako bi pomogla da učenje postane lakše, zabavnije i učinkovitije. Bilo da se pripremaš za ispite, želiš bolje razumjeti gradivo ili jednostavno proširiti svoje znanje, mi smo tu za tebe!

Povezali smo najnaprednije AI alate s podrškom instruktora kako bismo stvorili okruženje prilagođeno tvom tempu i potrebama - modernije, brže i pouzdanije.

Kako bi maksimalno iskoristio/la sve prednosti aplikacije, pogledaj naš kratki video sa savjetima za rad: ${SHORT_VIDEO_URL}

Kao dobrodošlicu pripremili smo tablicu s linkovima na dvije u potpunosti riješene državne mature (A i B razina): https://docs.google.com/spreadsheets/d/1oRSbet1JXSh9yG7_FL6XgQXf6QK5gu2H/edit?usp=sharing&ouid=107754712315620356659&rtpof=true&sd=true. Ne brini ako se još ne pripremaš za maturu – mislili smo i na tebe pa smo zadatke kategorizirali i prema temama srednjoškolskih udžbenika.

Tips & tricks

Korištenje dva prozora je korisno jer omogućuje rad s različitim modelima, a time i bolje razumijevanje gradiva.

Prilagodi sebi prozor omogućuje postavljanje općih smjernica koje model slijedi tijekom cijelog razgovora.

Ukoliko imaš bilo kakvih pitanja ili trebaš pomoć, javi se na podrska@edurete.com.

Želimo ti puno uspjeha i uživanja u učenju!

Srdačan pozdrav,
Tim edurete

edurete - mreža znanja
    `,
  },

  SUBSCRIPTION_WELCOME: {
    subject: (tier: string) => `Dobrodošli u ${SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || "Premium"} plan! 🚀`,
    getHtml: (firstName: string, tier: string) => {
      let textBlockContent = "";

      if (tier === MESSAGE_TIER.PAID_PLUS) {
        // Content for eduAI Start -> eduAI Duo (new subscription to Duo)
        textBlockContent = `
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px; padding-bottom:10px;">
                Pozdrav ${firstName},
            </td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Izuzetno nam je drago što si odlučio/la isprobati <strong>eduAI Duo</strong> paket i otvoriti vrata potpuno novom iskustvu učenja.
                Naš alat spaja najbolje od umjetne inteligencije i ljudske podrške kako bi tvoje učenje bilo brže, jasnije i učinkovitije. Uz pristup moćnom AI sustavu prilagođenom učenicima i studentima, na raspolaganju su ti i <strong>četiri individualna termina instrukcija mjesečno.</strong>
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                edureteAI nije samo alat za odgovaranje na pitanja – on razumije zadatke, nudi više načina rješavanja, objašnjava korak po korak, crta grafove i čita ih, te prilagođava pristup učenju upravo tvojim željama.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Kako bi maksimalno iskoristio/la sve prednosti Duo paketa, pogledaj naš
                <a href="${SHORT_VIDEO_URL}" target="_blank" style="color:#155DFC;">kratki video</a> sa savjetima za rad.
            </td>
        </tr>
      `;
      } else {
        // Content for eduAI Start -> eduAI Solo (new subscription to Solo)
        textBlockContent = `
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px; padding-bottom:10px;">
                Pozdrav ${firstName},
            </td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Izuzetno nam je drago što si odlučio/la prijeći s <strong>eduAI Start paketa na eduAI Solo</strong> i podići svoje učenje na višu razinu.
                Umjesto dosadašnjih 50 poruka mjesečno, sada ti je na raspolaganju čak <strong>1500 interakcija</strong> s našim naprednim AI asistentima, koji koriste kombinaciju najjačih sustava – posebno prilagođenih za školski i fakultetski rad.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Kao mali znak dobrodošlice, poklanjamo ti <a href="https://docs.google.com/spreadsheets/d/1_g8ZCY2Y9kuS0bRik8qiK7F58N_skTyj/edit?usp=sharing&ouid=107754712315620356659&rtpof=true&sd=true" target="_blank" style="color:#155DFC;">rješenja državne mature</a>. Iskoristi ih za vježbu, samoprovjeru i bolje razumijevanje zadataka.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Osim brzih objašnjenja zadataka, edureteAI sada može crtati i čitati grafove, predlagati metode rješavanja te ti nuditi stalnu podršku dok samostalno učiš. Možeš i prilagoditi način na koji ti AI pomaže – samo unesi svoje želje u <strong>"prilagodi sebi" box</strong> i model će se ponašati u skladu s tvojim stilom učenja.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Kako bi odmah započeo/la s novim mogućnostima, pogledaj naš
                <a href="${SHORT_VIDEO_URL}" target="_blank" style="color:#155DFC;">kratki video</a> sa savjetima za rad.
            </td>
        </tr>
      `;
      }

      return createBaseEmailTemplate("hero-image.jpg", textBlockContent);
    },
    getText: (firstName: string, tier: string) => {
      let content = "";
      if (tier === MESSAGE_TIER.PAID_PLUS) {
        content = `Izuzetno nam je drago što si odlučio/la isprobati eduAI Duo paket i otvoriti vrata potpuno novom iskustvu učenja.

Naš alat spaja najbolje od umjetne inteligencije i ljudske podrške kako bi tvoje učenje bilo brže, jasnije i učinkovitije. Uz pristup moćnom AI sustavu prilagođenom učenicima i studentima, na raspolaganju su ti i četiri individualna termina instrukcija mjesečno.

edureteAI nije samo alat za odgovaranje na pitanja – on razumije zadatke, nudi više načina rješavanja, objašnjava korak po korak, crta grafove i čita ih, te prilagođava pristup učenju upravo tvojim željama.

Kako bi maksimalno iskoristio/la sve prednosti Duo paketa, pogledaj naš kratki video sa savjetima za rad: ${SHORT_VIDEO_URL}`;
      } else {
        content = `Izuzetno nam je drago što si odlučio/la prijeći s eduAI Start paketa na eduAI Solo i podići svoje učenje na višu razinu.

Umjesto dosadašnjih 50 poruka mjesečno, sada ti je na raspolaganju čak 1500 interakcija s našim naprednim AI asistentima, koji koriste kombinaciju najjačih sustava – posebno prilagođenih za školski i fakultetski rad.

Kao mali znak dobrodošlice, poklanjamo ti rješenja državne mature (https://docs.google.com/spreadsheets/d/1_g8ZCY2Y9kuS0bRik8qiK7F58N_skTyj/edit?usp=sharing&ouid=107754712315620356659&rtpof=true&sd=true). Iskoristi ih za vježbu, samoprovjeru i bolje razumijevanje zadataka.

Osim brzih objašnjenja zadataka, edureteAI sada može crtati i čitati grafove, predlagati metode rješavanja te ti nuditi stalnu podršku dok samostalno učiš. Možeš i prilagoditi način na koji ti AI pomaže – samo unesi svoje želje u "prilagodi sebi" box i model će se ponašati u skladu s tvojim stilom učenja.

Kako bi odmah započeo/la s novim mogućnostima, pogledaj naš kratki video sa savjetima za rad: ${SHORT_VIDEO_URL}`;
      }

      return `
Pozdrav ${firstName},

${content}

Tips & tricks

Korištenje dva prozora je korisno jer omogućuje rad s različitim modelima, a time i bolje razumijevanje gradiva.

Prilagodi sebi prozor omogućuje postavljanje općih smjernica koje model slijedi tijekom cijelog razgovora.

Ukoliko imaš bilo kakvih pitanja ili trebaš pomoć, javi se na podrska@edurete.com.

Želimo ti puno uspjeha i uživanja u učenju!

Srdačan pozdrav,
Tim edurete

edurete - mreža znanja
      `;
    },
  },

  UPGRADE: {
    subject: () => `Uspješno nadograđeno na ${SUBSCRIPTION_PLANS[MESSAGE_TIER.PAID_PLUS]?.name || "Premium"} plan! 🎉`,
    getHtml: (firstName: string) => {
      // Content for eduAI Solo -> eduAI Duo upgrade
      const textBlockContent = `
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px; padding-bottom:10px;">
                Pozdrav ${firstName},
            </td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Izuzetno nam je drago što si nadogradio/la svoj paket s <strong>eduAI Solo na eduAI Duo</strong> i napravio/la još jedan korak naprijed u učenju.
                Uz sve mogućnosti napredne umjetne inteligencije sada imaš i <strong>redovitu podršku instruktora</strong>. Zadržavaš svoj AI prostor za učenje, poruke i interakcije, ali dobivaš i <strong>četiri online sata instrukcija mjesečno</strong> koje možeš dogovoriti prema svom rasporedu.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Naš AI alat, koji objedinjuje snage vodećih sustava (Gemini, Anthropic, ChatGPT i Deepseek), tu je da ti pomogne u svakodnevnom radu – od objašnjavanja gradiva, preko crtanja i tumačenja grafova, do personalizirane pomoći u rješavanju zadataka.
            </td>
        </tr>
        <tr>
            <td height="10"></td>
        </tr>
        <tr>
            <td align="left" style="font-size:14px; color:#0D1A28; line-height:18px;">
                Kako bi odmah iskoristio/la sve prednosti, predlažemo da dogovoriš svoj prvi termin instrukcija i pogledaš naš
                <a href="${SHORT_VIDEO_URL}" target="_blank" style="color:#155DFC;">kratki video</a> sa savjetima za rad.
            </td>
        </tr>
      `;
      return createBaseEmailTemplate("hero-image.jpg", textBlockContent);
    },
    getText: (firstName: string) => {
      return `
Pozdrav ${firstName},

Izuzetno nam je drago što si nadogradio/la svoj paket s eduAI Solo na eduAI Duo i napravio/la još jedan korak naprijed u učenju.

Uz sve mogućnosti napredne umjetne inteligencije sada imaš i redovitu podršku instruktora. Zadržavaš svoj AI prostor za učenje, poruke i interakcije, ali dobivaš i četiri online sata instrukcija mjesečno koje možeš dogovoriti prema svom rasporedu.

Naš AI alat, koji objedinjuje snage vodećih sustava (Gemini, Anthropic, ChatGPT i Deepseek), tu je da ti pomogne u svakodnevnom radu – od objašnjavanja gradiva, preko crtanja i tumačenja grafova, do personalizirane pomoći u rješavanju zadataka.

Kako bi odmah iskoristio/la sve prednosti, predlažemo da dogovoriš svoj prvi termin instrukcija i pogledaš naš kratki video sa savjetima za rad: ${SHORT_VIDEO_URL}

Tips & tricks

Korištenje dva prozora je korisno jer omogućuje rad s različitim modelima, a time i bolje razumijevanje gradiva.

Prilagodi sebi prozor omogućuje postavljanje općih smjernica koje model slijedi tijekom cijelog razgovora.

Ukoliko imaš bilo kakvih pitanja ili trebaš pomoć, javi se na podrska@edurete.com.

Želimo ti puno uspjeha i uživanja u učenju!

Srdačan pozdrav,
Tim edurete

edurete - mreža znanja
      `;
    },
  },
};
