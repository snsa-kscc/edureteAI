"use client";

import { Chat } from "@/lib/types";
import { SidebarItems } from "./sidebar-items";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getChats } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";

interface SidebarListProps {
  userId: string | null;
  userData: Record<string, string>;
  orgRole: string | null | undefined;
  chats?: Chat[];
}

export function SidebarList({ userId, userData, orgRole, chats: initialChats }: SidebarListProps) {
  const [user, setUser] = useState<string | null>(userId);
  const [chats, setChats] = useState<Chat[]>(initialChats || []);
  const { data, mutate: server_getChats, isPending } = useMutation({ mutationFn: getChats, onSuccess: setChats });

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      {orgRole && (
        <div className="space-y-2 p-2">
          <Select
            value={user!}
            onValueChange={(value) => {
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
                {Object.entries(userData).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      {chats?.length ? (
        <div className="space-y-2 p-2">
          <SidebarItems userId={user} chats={chats} />
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
}
