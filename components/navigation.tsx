"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 mb-4">
      <Link
        href="/dashboard/openai"
        className={`px-3 py-2 rounded-md ${pathname === "/dashboard/openai" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
      >
        OpenAI Dashboard
      </Link>
      <Link
        href="/dashboard/anthropic"
        className={`px-3 py-2 rounded-md ${pathname === "/dashboard/anthropic" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
      >
        Anthropic Dashboard
      </Link>
      <Link href="/" className="px-3 py-2 rounded-md bg-secondary">
        Home
      </Link>
    </nav>
  );
}
