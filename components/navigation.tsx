"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { getUsersDataXlsx } from "@/lib/xlsx-actions";

export function Navigation() {
  const pathname = usePathname();

  const handleDownload = async () => {
    try {
      const blob = await getUsersDataXlsx();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, "-");

      a.download = `edureteAI-report-${formattedDate}_${formattedTime}.xlsx`;
      a.click();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <nav className="flex gap-4 mb-4">
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
      <Button variant="outline" className="ml-auto" onClick={handleDownload}>
        Export Data
      </Button>
    </nav>
  );
}
