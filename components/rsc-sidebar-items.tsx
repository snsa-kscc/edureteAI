"use client";

import { Chat } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { RscSidebarItem } from "./rsc-sidebar-item";
import { RscSidebarActions } from "./rsc-sidebar-actions";
import { removeChat } from "@/lib/actions";

export function RscSidebarItems({ chats, userId }: { chats?: Chat[]; userId: string | null }) {
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
              <RscSidebarItem index={index} chat={chat}>
                <RscSidebarActions chat={chat} userId={userId} removeChat={removeChat} />
              </RscSidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  );
}
