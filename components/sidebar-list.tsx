"use client";

import { Chat } from "@/lib/types";
import { SidebarItems } from "./sidebar-items";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
interface SidebarListProps {
  userId: string | null;
  userData: Record<string, string>;
  orgRole: string | null | undefined;
  chats?: Chat[];
}

export function SidebarList({ userId, userData, orgRole, chats }: SidebarListProps) {
  return (
    <div className="h-full overflow-auto scrollbar-thin">
      {orgRole && (
        <div className="space-y-2 p-2">
          <Select value={userId!}>
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
          <SidebarItems userId={userId} chats={chats} />
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
}
