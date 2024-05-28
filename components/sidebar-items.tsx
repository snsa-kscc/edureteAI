"use client";

import { Chat } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarItem } from "./sidebar-item";
import { SidebarActions } from "./sidebar-actions";
import { removeChat } from "@/lib/actions";

export function SidebarItems({ chats, userId }: { chats?: Chat[]; userId: string | null }) {
  if (!chats?.length) return null;

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >
              <SidebarItem index={index} chat={chat}>
                <SidebarActions chat={chat} userId={userId} removeChat={removeChat} />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  );
}
