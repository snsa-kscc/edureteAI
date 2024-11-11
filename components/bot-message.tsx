"use client";

import { useStreamableText } from "@/hooks/use-streamable-text";
import { StreamableValue, useUIState } from "ai/rsc";
import { ReactNode, useEffect } from "react";

interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
}

export function BotMessage({ content }: { content: string | StreamableValue<string> }) {
  const [_, setConversation] = useUIState();
  const text = useStreamableText(content);

  useEffect(() => {
    if (text.length > 0) {
      setConversation((currentConversation: ClientMessage[]) => [...currentConversation, { id: Math.random().toString(), role: "assistant", content: text }]);
    }
  }, [text]);

  return <div className="text-red-500">{text}</div>;
}
