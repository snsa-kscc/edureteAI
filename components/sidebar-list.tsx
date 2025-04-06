"use client";

import { Chat } from "@/types";
import { SidebarItems } from "./sidebar-items";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getChats } from "@/lib/redis-actions";
import { useMutation } from "@tanstack/react-query";
import { IconSpinner } from "./ui/icons";
import { MessageUsageProgress } from "./message-usage-progress";

interface SidebarListProps {
  userId: string | null | undefined;
  userData: { userId: string; firstName: string; lastName: string; emailAddress: string }[];
  role: string | null | undefined;
  chats?: Chat[];
}

export function SidebarList({ userId, userData, role, chats: initialChats }: SidebarListProps) {
  const [user, setUser] = useState<string | null | undefined>(userId);
  const [chats, setChats] = useState<Chat[]>(initialChats || []);
  const { mutate: server_getChats, isPending } = useMutation({ mutationFn: getChats, onSuccess: setChats });

  useEffect(() => {
    setChats(initialChats || []);
  }, [initialChats]);

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <MessageUsageProgress userId={userId!} />
      {role && (
        <div className="space-y-2 p-2">
          <Select
            value={user!}
            onValueChange={(value) => {
              setChats([]);
              setUser(value);
              server_getChats(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Active Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Active Users</SelectLabel>
                {userData.map(({ userId, firstName, lastName, emailAddress }) => (
                  <SelectItem key={userId} value={userId} title={emailAddress}>
                    {`${firstName} ${lastName}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      {isPending ? (
        <div className="flex items-center justify-center p-8 text-center">
          <IconSpinner className="animate-spin mr-2" />
          <p className="text-sm text-muted-foreground">Učitavam...</p>
        </div>
      ) : chats?.length ? (
        <div className="space-y-2 p-2">
          <SidebarItems userId={user} chats={chats} />
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Nema razgovora.</p>
        </div>
      )}
    </div>
  );
}
