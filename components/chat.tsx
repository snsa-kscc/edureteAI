"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { readStreamableValue, useAIState, useActions, useUIState } from "ai/rsc";
import { CopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SendHorizontalIcon } from "lucide-react";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";

interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
}

export function Chat({ userId, id, initialModel, initialSystem }: { userId: string | null; id: string; initialModel: string; initialSystem: string }) {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [model, setModel] = useState<string>(initialModel);
  const [system, setSystem] = useState<string>(initialSystem);
  const [conversation, setConversation] = useUIState();
  const { submitUserMessage } = useActions();
  const ref = useRef<HTMLDivElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const [aiState] = useAIState();
  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [conversation]);

  return (
    <div className="w-full p-4 flex flex-col h-[80vh]">
      <div className="flex justify-between">
        <Select onValueChange={setModel} value={model}>
          <SelectTrigger className="max-w-72 mb-2">
            <SelectValue placeholder="OpenAI/GPT-3.5" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Models</SelectLabel>
              <SelectItem value="gpt-4o">OpenAI/GPT-4o</SelectItem>
              <SelectItem value="gpt-4-turbo">OpenAI/GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4">OpenAI/GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">OpenAI/GPT-3.5</SelectItem>
              <SelectItem value="claude-3-opus-20240229">Anthropic/Opus</SelectItem>
              <SelectItem value="claude-3-sonnet-20240229">Anthropic/Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku-20240307">Anthropic/Haiku</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mb-2">
              System Prompt
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 m-4">
            <Textarea className="p-2 h-48" onChange={(e) => setSystem(e.target.value)} value={system} placeholder="Enter a system prompt"></Textarea>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="mb-2 grow rounded-md border p-4" ref={ref}>
        {conversation.map((m: any) => (
          <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
            {m.role === "user" && (
              <div className="mb-6 flex gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="text-sm">U</AvatarFallback>
                </Avatar>
                <div className="mt-1.5">
                  <p className="font-semibold">You</p>
                  <div className="mt-1.5 text-sm text-zinc-500">{m.content}</div>
                </div>
              </div>
            )}

            {m.role === "assistant" && (
              <div className="mb-6 flex gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-emerald-500 text-white">AI</AvatarFallback>
                </Avatar>
                <div className="mt-1.5 w-full">
                  <div className="flex justify-between">
                    <p className="font-semibold">Bot</p>
                    <CopyToClipboard message={m} className="-mt-1" />
                  </div>
                  <div className="mt-2 text-sm text-zinc-500">{m.content}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
      {aiState.userId === userId && (
        <form
          ref={formRef}
          onSubmit={async (e: any) => {
            e.preventDefault();
            setContent("");
            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, { id: Math.random().toString(), role: "user", content }]);
            const message = await submitUserMessage({ content, model, system });
            let textContent = "";
            if (message.error) {
              toast.error(message.error);
            } else {
              for await (const delta of readStreamableValue(message.stream)) {
                textContent = `${textContent}${delta}`;
                setConversation([
                  ...aiState.messages,
                  { id: Math.random().toString(), role: "user", content },
                  { id: Math.random().toString(), role: "assistant", content: textContent },
                ]);
              }
            }
          }}
          className="relative"
        >
          <Textarea
            name="message"
            value={content}
            onKeyDown={onKeyDown}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask me anything..."
            className="pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500"
          />
          <Button size="icon" type="submit" variant="secondary" disabled={content === ""} className="absolute right-2 bottom-2 h-8 w-10">
            <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />
          </Button>
        </form>
      )}
    </div>
  );
}
