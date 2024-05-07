"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SendHorizontalIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function Chat({ chatAreaId, chatData }: { chatAreaId: string; chatData?: any[] }) {
  const [model, setModel] = useState("OpenAI/gpt-3.5-turbo-0125");
  const [userSystemPrompt, setUserSystemPrompt] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);
  const params = useParams();

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    body: {
      model,
      chatId: params.id,
      userSystemPrompt,
      chatAreaId,
    },
  });

  const mappedData: any[] = chatData
    ? chatData
        .filter((item) => item.data.content)
        .reverse()
        .map((item) => ({
          content: item.data.content,
          role: item.type === "human" ? "user" : "assistant",
        }))
    : [];

  useEffect(() => {
    setMessages(mappedData);
  }, []);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <div className="w-full p-4 flex flex-col h-[80vh]">
      <div className="flex justify-between">
        <Select onValueChange={setModel}>
          <SelectTrigger className="max-w-72 mb-2">
            <SelectValue placeholder="OpenAI/GPT-3.5" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Models</SelectLabel>
              <SelectItem value="OpenAI/gpt-3.5-turbo-0125">OpenAI/GPT-3.5</SelectItem>
              <SelectItem value="OpenAI/gpt-4-turbo">OpenAI/GPT-4 Turbo</SelectItem>
              <SelectItem value="OpenAI/gpt-4-0125-preview">OpenAI/GPT-4</SelectItem>
              <SelectItem value="OpenAI/gpt-4-1106-preview">OpenAI/GPT-4 1106</SelectItem>
              <SelectItem value="OpenAI/gpt-4">OpenAI/GPT-4 0613</SelectItem>
              <SelectItem value="Anthropic/claude-3-opus-20240229">Anthropic/Opus</SelectItem>
              <SelectItem value="Anthropic/claude-3-sonnet-20240229">Anthropic/Sonnet</SelectItem>
              <SelectItem value="Anthropic/claude-3-haiku-20240307">Anthropic/Haiku</SelectItem>
              <SelectItem value="Anthropic/claude-2.1">Anthropic/Claude 2.1</SelectItem>
              <SelectItem value="Anthropic/claude-2.0">Anthropic/Claude 2.0</SelectItem>
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
            <Textarea
              className="p-2 h-48"
              onChange={(e) => setUserSystemPrompt(e.target.value)}
              value={userSystemPrompt}
              placeholder="Enter a system prompt"
            ></Textarea>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="mb-2 grow rounded-md border p-4" ref={ref}>
        {error && <p className="text-sm text-red-400">{error.message}</p>}
        {messages.map((m, i) => (
          <div key={i} className="mr-6 whitespace-pre-wrap md:mr-12">
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
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          name="message"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e: any) => e.key === "Enter" && !e.shiftKey && !isLoading && handleSubmit(e)}
          placeholder="Ask me anything..."
          className="pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500"
        />
        <Button size="icon" type="submit" variant="secondary" disabled={isLoading} className="absolute right-2 bottom-2 h-8 w-10">
          <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />
        </Button>
      </form>
    </div>
  );
}
