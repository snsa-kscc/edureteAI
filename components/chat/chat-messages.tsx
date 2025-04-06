import { forwardRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Markdown } from "@/components/markdown";
import { CopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
  userName: string | null | undefined;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages, userName }, ref) => {
  return (
    <ScrollArea className="mb-2 grow rounded-md border p-4 h-full min-h-32" ref={ref}>
      {messages.map((message) => (
        <div key={message.id} className="sm:mr-6 whitespace-pre-wrap md:mr-12">
          {message.role === "user" ? (
            <div className="mb-6 flex gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="text-sm">{userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-1.5">
                <p className="font-semibold opacity-70">{userName}</p>
                <div className="mt-1.5 text-sm leading-relaxed">
                  {/* start legacy  */}
                  {Array.isArray(message.content)
                    ? message.content.map((item, index) => (
                        <div key={index}>
                          {item.type === "text" && item.text}
                          {item.type === "image" && (
                            <Image src={item.image || "/placeholder.svg"} alt="Uploaded image" className="mt-2 max-w-xs rounded" width={250} height={250} />
                          )}
                        </div>
                      ))
                    : message.content}
                  {/*  end legacy  */}
                  {message.experimental_attachments?.map(
                    (attachment, index) =>
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
                {message.parts && message.parts.length > 0 && message.parts.some((part) => part.type === "reasoning") && (
                  <div className="my-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Razmišljanje:</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message.parts.find((part) => part.type === "reasoning")?.reasoning}</p>
                  </div>
                )}
                <div className="mt-2 text-sm leading-relaxed">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  );
});

ChatMessages.displayName = "ChatMessages";
