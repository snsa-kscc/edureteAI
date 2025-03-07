"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { IconMessage, IconSpinner } from "@/components/ui/icons";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Chat } from "@/types";
import { cn } from "@/lib/utils";

export function SidebarItem({ index, chat, children }: { index: number; chat: Chat; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isActive = pathname === chat.path;
  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null);
  const shouldAnimate = index === 0 && isActive && newChatId;

  if (!chat?.id) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(chat.path);
  };

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? "initial" : undefined}
      animate={shouldAnimate ? "animate" : undefined}
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
    >
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        {isLoading ? <IconSpinner className="mr-2 mt-1 h-4 w-4 animate-spin text-emerald-400" /> : <IconMessage className="mr-2 mt-1 text-emerald-400" />}
      </div>
      <Link
        href={chat.path}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10",
          isActive && "bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800"
        )}
      >
        <div className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all" title={new Date(chat.createdAt).toLocaleString("hr-HR")}>
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split("").map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null);
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  );
}
