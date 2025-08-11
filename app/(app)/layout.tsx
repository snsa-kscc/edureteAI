import { ClerkProvider } from "@clerk/nextjs";
import { hrHR } from "@clerk/localizations";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "edureteAI - matematički asistent",
  description: "edureteAI - matematički asistent",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { sessionClaims } = await auth();

  return (
    <ClerkProvider afterSignOutUrl={"/"} localization={hrHR}>
      {/* <SyncActiveOrganization membership={sessionClaims?.membership} /> */}
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
            integrity="sha384-uj6qT5V/e7d1kh0Ue9vSQrD2JBP1c9b+x8kQe2aTL8h9JimkGsSwSv1pyhXpchLz"
            crossOrigin="anonymous"
          />
        </head>
        <body>
          <Toaster position="top-center" />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
