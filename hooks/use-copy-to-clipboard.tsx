"use client";

import { cn } from "@/lib/utils";
import { type UIMessage } from "ai";

import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: UIMessage;
}

export function CopyToClipboard({ message, className, ...props }: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    // Extract text from message parts (AI SDK v5 format)
    const textContent = message.parts
      ?.filter(part => part.type === "text")
      .map(part => part.text)
      .join("\n") || "";
    copyToClipboard(textContent);
  };

  return (
    <div className={cn("", className)} {...props}>
      <Button variant="secondary" size="icon" className="h-8 w-8 p-2" onClick={onCopy}>
        {isCopied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4 text-zinc-500" />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  );
}
