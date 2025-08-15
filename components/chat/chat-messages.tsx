"use client";

import { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Markdown } from "@/components/markdown";
import { CopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ToolResult } from "@/components/chat/tool-result";
import type { UIMessage } from "ai";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReasoningPart {
  type: "reasoning";
  reasoningText: string;
  details?: Array<{ type: "text"; text: string }>;
}

interface ChatMessagesProps {
  messages: UIMessage[];
  userName: string | null | undefined;
  status?: "streaming" | "submitted" | "error" | "ready";
}

interface ReasoningSectionProps {
  part: ReasoningPart;
  isStreaming: boolean;
}

function ReasoningSection({ part, isStreaming }: ReasoningSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: "0.5rem",
    },
  };

  useEffect(() => {
    if (!isStreaming) {
      setIsExpanded(false);
    }
  }, [isStreaming]);

  return (
    <div className="flex flex-col my-2">
      {isStreaming ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Razmišljam...</div>
          <div className="animate-spin">
            <Loader2 className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Moje razmišljanje</div>
          <button
            className={cn("cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200 p-1", {
              "dark:bg-zinc-800 bg-zinc-200": isExpanded,
            })}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      )}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l-2 pl-3 dark:border-zinc-700 border-zinc-300"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {part.details && part.details.map((detail, detailIndex) => (detail.type === "text" ? <Markdown key={detailIndex}>{detail.text}</Markdown> : null))}
            {!part.details && part.reasoningText && <Markdown>{part.reasoningText}</Markdown>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages, userName, status }, ref) => {
  return (
    <ScrollArea className="mb-2 grow rounded-md border p-4 h-full min-h-32" ref={ref}>
      {messages.map((message, index) => (
        <div key={index} className="sm:mr-6 whitespace-pre-wrap md:mr-12">
          {message.role === "user" ? (
            <div className="mb-6 flex gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="text-sm">{userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-1.5">
                <p className="font-semibold opacity-70">{userName}</p>
                <div className="mt-1.5 text-sm leading-relaxed">
                  {/* AI SDK v5 parts format */}
                  {message.parts?.map((part, index) => {
                    if (part.type === "text") {
                      return <div key={index}>{part.text}</div>;
                    }
                    if (part.type === "file" && part.mediaType?.startsWith("image/")) {
                      return (
                        <div key={index} className="mb-2">
                          <Image src={part.url || "/placeholder.svg"} alt="Uploaded image" width={250} height={250} className="rounded-lg object-cover" />
                        </div>
                      );
                    }
                    return null;
                  })}
                  {/* Legacy content format fallback */}
                  <>
                    {Array.isArray((message as any).content)
                      ? (message as any).content.map((item: any, index: number) => (
                          <div key={index}>
                            {item.type === "text" && item.text}
                            {item.type === "image" && (
                              <Image src={item.image || "/placeholder.svg"} alt="Uploaded image" className="mt-2 max-w-xs rounded" width={250} height={250} />
                            )}
                          </div>
                        ))
                      : message.parts
                      ? null
                      : (message as any).content}
                    {(message as any).experimental_attachments?.map(
                      (attachment: any, index: number) =>
                        attachment.contentType?.startsWith("image/") && (
                          <div key={index} className="mb-2">
                            <Image
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name || "Attached image"}
                              width={250}
                              height={250}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )
                    )}
                  </>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-emerald-500 text-white">eAI</AvatarFallback>
              </Avatar>
              <div className="mt-1.5 w-full">
                <div className="flex justify-between">
                  <p className="font-semibold opacity-70">edureteAI</p>
                  <CopyToClipboard message={message} className="-mt-1" />
                </div>

                {/* Reasoning section - always at the top */}
                {message.parts?.map((part, partIndex) => {
                  if (part.type === "reasoning") {
                    return (
                      <ReasoningSection
                        key={partIndex}
                        part={{
                          type: "reasoning",
                          reasoningText: part.text || "",
                          details: undefined,
                        }}
                        isStreaming={status === "streaming" && partIndex === message.parts.length - 1}
                      />
                    );
                  }
                  return null;
                })}

                {/* Text content */}
                <div className="mt-2 text-sm leading-relaxed">
                  {/* AI SDK v5: Extract text from parts */}
                  {message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part, index) => (
                      <Markdown key={index}>{part.text}</Markdown>
                    ))}

                  {/* Legacy fallback: use message.content */}
                  {!message.parts && (message as any).content && <Markdown>{(message as any).content}</Markdown>}
                </div>

                {/* Tool results - always at the end with animation */}
                <AnimatePresence>
                  {message.parts?.map((part, partIndex) => {
                    // Handle AI SDK v5 tool parts - they use specific naming like "tool-toolName"
                    const partType = part.type as string;
                    if (partType.startsWith("tool-")) {
                      const toolName = partType.replace("tool-", "");
                      const toolPart = part as any;

                      // Only render if we have output/result
                      if (toolPart.output !== undefined || toolPart.result !== undefined) {
                        return (
                          <motion.div
                            key={partIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-3"
                          >
                            <ToolResult toolName={toolName} result={toolPart.output || toolPart.result} args={toolPart.input || toolPart.args} />
                          </motion.div>
                        );
                      }
                    }

                    // Handle legacy tool-invocation format
                    if (part.type === "tool-invocation") {
                      const toolInvocation = (part as any).toolInvocation;
                      if (toolInvocation && "result" in toolInvocation && toolInvocation.result !== undefined) {
                        return (
                          <motion.div
                            key={partIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-3"
                          >
                            <ToolResult toolName={toolInvocation.toolName} result={toolInvocation.result} args={toolInvocation.args} />
                          </motion.div>
                        );
                      }
                    }

                    return null;
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  );
});

ChatMessages.displayName = "ChatMessages";
