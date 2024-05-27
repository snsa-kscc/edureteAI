import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { SyncActiveOrganization } from "@/components/sync-active-orgs";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "edureteAI",
  description: "edureteAI - Math assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionClaims } = auth();

  return (
    <ClerkProvider>
      {/* <SyncActiveOrganization membership={sessionClaims?.membership} /> */}
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Toaster position="top-center" />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
