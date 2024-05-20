"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Protect } from "@clerk/nextjs";

import { useMutation } from "@tanstack/react-query";
import { updateDbItem } from "@/app/actions";

interface Item {
  href: string;
  title: string;
}

export default function Sidebar({ updateItem }: { updateItem: any }) {
  const params = useParams();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [othersItems, setOthersItems] = useState<Item[]>([]);
  const router = useRouter();
  const { userId, orgId } = useAuth();

  async function handleRetrieveSidebar(url: string, setter: any) {
    const response = await fetch(url, {
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
        let parseDate = Number(item.split("-")[1]);
        return {
          href: `/chat/${item}`,
          title: new Date(parseDate).toLocaleString("hr"),
        };
      });

      if (
        setter === setUserItems &&
        params.id.toString().split("-")[0] === userId &&
        dbChatHistory.filter((item: { href: string }) => item.href === `/chat/${params.id}`).length === 0
      ) {
        const unixTime = params.id.toString().split("-")[1];
        setter([
          {
            href: `/chat/${userId}-${unixTime}`,
            title: new Date(Number(unixTime)).toLocaleString("hr"),
          },
          ...dbChatHistory,
        ]);
      } else {
        setter(dbChatHistory);
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
    handleRetrieveSidebar("/api/retrieve-user-history", setUserItems);
  }, []);

  if (orgId) {
    useEffect(() => {
      handleRetrieveSidebar("/api/retrieve-others-history", setOthersItems);
    }, []);
  }

  const { data, mutate: server_updateDbItem } = useMutation({
    mutationFn: updateDbItem,
  });

  return (
    <>
      <ScrollArea className="min-w-60 max-h-[720px] overflow-scroll flex flex-col justify-top px-2">
        <div className="ml-auto w-full">
          <Button className="w-full mt-2 mb-10" onClick={handleUpdateSidebar}>
            New Chat
          </Button>
        </div>
        <div>My history</div>
        <SidebarNav items={userItems} updateItem={updateItem} className="flex-col" />
        <Protect permission="org:all_users:read">
          <div>Others history</div>
          <SidebarNav items={othersItems} updateItem={updateItem} className="flex-col" />
        </Protect>
      </ScrollArea>
      {/* <Button onClick={() => server_updateDbItem("werwerw")}>click me</Button>
      <p>{JSON.stringify(data)}</p> */}
    </>
  );
}
