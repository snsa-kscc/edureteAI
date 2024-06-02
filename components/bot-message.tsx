"use client";

import { useStreamableText } from "@/hooks/use-streamable-text";
import { StreamableValue } from "ai/rsc";

export function BotMessage({ content }: { content: string | StreamableValue<string> }) {
  const text = useStreamableText(content);

  return <div>{text}</div>;
}
