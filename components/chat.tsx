"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { readStreamableValue, useAIState, useActions, useUIState } from "ai/rsc";
import { CopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SendHorizontalIcon, ImageIcon, Loader2, X } from "lucide-react";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/upload-actions";
import type { MessageContent, ClientMessage } from "@/types";

export function Chat({
  userId,
  id,
  initialModel,
  initialSystem,
}: {
  userId: string | null | undefined;
  id: string;
  initialModel: string;
  initialSystem: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [model, setModel] = useState<string>(() => {
    if (initialModel === "claude-3-5-sonnet-20240620") {
      return "claude-3-5-sonnet-20241022";
    }
    return initialModel;
  });
  const [system, setSystem] = useState<string>(initialSystem);
  const [conversation, setConversation] = useUIState();
  const { submitUserMessage } = useActions();
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const [aiState] = useAIState();
  const [_, setNewChatId] = useLocalStorage("newChatId", id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const modelsWithoutImageSupport = ["o1-preview", "o1-mini", "claude-3-5-haiku-20241022"];

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength % 2 === 0 && messagesLength > 0) {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      startTransition(async () => {
        const { success, url } = await uploadFileToR2(formData);
        if (success && url) {
          setUploadedImage(url);
        } else {
          throw new Error("Failed to upload image");
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDeleteImage = async () => {
    if (!uploadedImage) return;

    startTransition(async () => {
      try {
        const { success } = await deleteFileFromR2(uploadedImage);
        if (success) {
          setUploadedImage(null);
          toast.success("Image deleted successfully");
        } else {
          throw new Error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete image");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageContent = uploadedImage
      ? [
          { type: "text", text: content },
          { type: "image", image: uploadedImage },
        ]
      : content;

    setUploadedImage(null);
    setContent("");
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: Math.random().toString(), role: "user", content: messageContent },
    ]);
    startTransition(async () => {
      const message = await submitUserMessage({ content: messageContent, model, system });
      let textContent = "";
      if (message.error) {
        toast.error(message.error);
      } else {
        for await (const delta of readStreamableValue(message.stream)) {
          textContent = `${textContent}${delta}`;
          setConversation([
            ...aiState.messages,
            { id: Math.random().toString(), role: "user", content: messageContent },
            { id: Math.random().toString(), role: "assistant", content: textContent },
          ]);
        }
      }
    });
  };

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
              <SelectItem value="o1-preview">OpenAI/o1-preview</SelectItem>
              <SelectItem value="o1-mini">OpenAI/o1-mini</SelectItem>
              <SelectItem value="gpt-4o">OpenAI/GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">OpenAI/GPT-4o-mini</SelectItem>
              <SelectItem value="gpt-4-turbo">OpenAI/GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4">OpenAI/GPT-4</SelectItem>
              <SelectItem value="claude-3-5-sonnet-20241022">Anthropic/Claude 3.5 Sonnet</SelectItem>
              <SelectItem value="claude-3-5-haiku-20241022">Anthropic/Claude 3.5 Haiku</SelectItem>
              <SelectItem value="claude-3-opus-20240229">Anthropic/Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet-20240229">Anthropic/Claude 3 Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku-20240307">Anthropic/Claude 3 Haiku</SelectItem>
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
                  <p className="font-semibold opacity-70">You</p>
                  <div className="mt-1.5 text-sm leading-relaxed">
                    {Array.isArray(m.content)
                      ? m.content.map((item: MessageContent, index: number) => (
                          <div key={index}>
                            {item.type === "text" && item.text}
                            {item.type === "image" && <img src={item.image} alt="uploaded image" className="mt-2 max-w-xs rounded" />}
                          </div>
                        ))
                      : m.content}
                  </div>
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
                    <p className="font-semibold opacity-70">Bot</p>
                    <CopyToClipboard message={m} className="-mt-1" />
                  </div>
                  <div className="mt-2 text-sm leading-relaxed">
                    <Markdown>{m.content}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
      {aiState.userId === userId && (
        <form ref={formRef} onSubmit={handleSubmit} className="relative">
          <Textarea
            name="message"
            value={content}
            onKeyDown={onKeyDown}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask me anything..."
            className={`placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 ${uploadedImage ? "pr-40" : "pr-28"}`}
            disabled={isPending}
          />
          <div className="flex items-center gap-3 mb-2 absolute bottom-2 right-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="text-emerald-500 h-8 w-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending || !!uploadedImage || modelsWithoutImageSupport.includes(model)}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            {uploadedImage && (
              <div className="relative h-9 w-9">
                <img src={uploadedImage} alt="uploaded image" className="h-full w-full object-cover rounded-sm" />
                <div onClick={handleDeleteImage} className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer bg-slate-700 rounded-full">
                  <X className="h-4 w-4 text-emerald-500 m-1" />
                </div>
              </div>
            )}
            <Button size="icon" type="submit" variant="secondary" disabled={isPending || content === ""} className="h-8 w-10">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin text-emerald-500" /> : <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
