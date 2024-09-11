"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="container mx-auto p-4 my-20">
      <h1 className="text-2xl font-bold mb-4">API Usage Dashboard</h1>
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
      </nav>
    </div>
  );
}
