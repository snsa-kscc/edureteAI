"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
  updateItem: any;
}

export function SidebarNav({ className, items, updateItem, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {items.map((item) => (
        <div key={item.href} className="flex items-center justify-around">
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
          <form action={() => updateItem(item.href)}>
            <Button variant="ghost">
              <Trash className="h-5 w-5 text-emerald-500" />
            </Button>
          </form>
        </div>
      ))}
    </nav>
  );
}
