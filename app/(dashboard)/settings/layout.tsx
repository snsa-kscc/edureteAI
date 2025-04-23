"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-7xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Link href={"/"} className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm">
          <MessageSquare className="h-4 w-4" />
          <span>Povratak na razgovor</span>
        </Link>
        <ModeToggle className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer border-0 hover:bg-transparent" />
      </div>
      <div className="my-12">
        <h1 className="text-2xl font-bold tracking-tight">Postavke</h1>
        <p className="text-muted-foreground">Upravljaj postavkama računa i preferencijama, saznaj novosti i javi nam se.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col space-y-1">
            <SettingsNavItem href={"/settings/account"} label="Račun" />
            <SettingsNavItem href={"/settings/news"} label="Novosti" />
            <SettingsNavItem href={"/settings/contact-us"} label="Kontakt" />
          </nav>
          <Separator className="my-4 md:hidden" />
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function SettingsNavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
    >
      {label}
    </Link>
  );
}
