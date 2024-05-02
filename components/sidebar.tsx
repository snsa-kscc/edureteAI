"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Item {
  href: string;
  title: string;
}

export default function Sidebar() {
  const params = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();
  const { userId } = useAuth();

  async function handleRetrieveSidebar() {
    const response = await fetch("/api/retrieve-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatHistoryAction: "retrieve", userId }),
    });

    if (response.ok) {
      let data = await response.json();

      let chatHistory: string[] = data.map((item: string) => {
        let parts = item.split("//");
        let result = parts.shift();
        return result;
      });
      chatHistory = [...new Set(chatHistory)];
      chatHistory = chatHistory.reverse();
      let dbChatHistory = chatHistory.map((item: string) => {
        let parseDate = Number(item.replace(`${userId}-`, ""));
        return {
          href: `/chat/${item}`,
          title: new Date(parseDate).toLocaleString("hr"),
        };
      });

      if (params.id && dbChatHistory.filter((item: { href: string }) => item.href === `/chat/${params.id}`).length === 0) {
        const unixTime = params.id.toString().replaceAll(`${userId}-`, "");

        setItems([
          {
            href: `/chat/${userId}-${unixTime}`,
            title: new Date(Number(unixTime)).toLocaleString("hr"),
          },
          ...dbChatHistory,
        ]);
      } else {
        setItems(dbChatHistory);
      }
    } else {
      console.error("Error retrieving chat history");
    }
  }

  async function handleUpdateSidebar() {
    const chatId = Date.now().toString();
    router.push(`/chat/${userId}-${chatId}`);
  }

  useEffect(() => {
    handleRetrieveSidebar();
  }, []);

  return (
    <ScrollArea className="min-w-60 max-h-[720px] overflow-scroll flex flex-col justify-top px-2">
      <div className="ml-auto w-full">
        <Button className="w-full mt-2 mb-10" onClick={handleUpdateSidebar}>
          New Chat
        </Button>
      </div>
      <SidebarNav items={items} className="flex-col" />
    </ScrollArea>
  );
}
