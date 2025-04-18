"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { readStreamableValue, useAIState, useActions, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { SendHorizontalIcon, ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { CHAT_MODELS, MODELS_WITHOUT_IMAGE_SUPPORT } from "@/lib/chat-config";
import { Markdown } from "@/components/markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
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
  initialSystem: string | undefined;
}) {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [model, setModel] = useState<string>(() => {
    const isValidModel = CHAT_MODELS.some((model) => model.value === initialModel);
    return isValidModel ? initialModel : "gemini-2.0-flash";
  });
  const [system, setSystem] = useState<string | undefined>(initialSystem);
  const [conversation, setConversation] = useUIState();
  const { submitUserMessage } = useActions();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const [aiState] = useAIState();
  const [_, setNewChatId] = useLocalStorage("newChatId", id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [userScrolled, setUserScrolled] = useState(false);

  useEffect(() => {
    setNewChatId(id);
  }, []);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength % 2 === 0 && messagesLength > 0) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    const viewport = scrollAreaRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      if (scrollTop + clientHeight < scrollHeight) {
        setUserScrolled(true);
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => {
      setUserScrolled(false);
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [conversation.length % 2 === 0]);

  useEffect(() => {
    if (scrollAreaRef.current === null || userScrolled) return;
    scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
  }, [conversation, userScrolled]);

  const { handleImageUpload } = useImageUpload({
    onImageUpload: (url) => setUploadedImage(url),
    uploadFileToR2,
    startTransition,
    disabled: isPending || !!uploadedImage || MODELS_WITHOUT_IMAGE_SUPPORT.includes(model),
  });

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
    if (content.trim() === "" && !uploadedImage) {
      return;
    }
    const messageTextWithImage = content.trim() === "" && uploadedImage ? "Analiziraj sliku." : content;
    const messageContent = uploadedImage
      ? [
          { type: "text", text: messageTextWithImage },
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

  const hasImagesInConversation = conversation.some((m: ClientMessage) => Array.isArray(m.content) && m.content.some((c) => c.type === "image"));

  return (
    <div className="w-full p-4 flex flex-col h-[80vh]">
      <div className="flex justify-between">
        <Select onValueChange={setModel} value={model}>
          <SelectTrigger className="max-w-72 mb-2">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="overflow-visible">
            <SelectGroup>
              <SelectLabel>Available Models</SelectLabel>
              <TooltipProvider>
                {CHAT_MODELS.map(({ value, label }) =>
                  hasImagesInConversation && MODELS_WITHOUT_IMAGE_SUPPORT.includes(value) ? (
                    <Tooltip key={value}>
                      <TooltipTrigger asChild>
                        <div>
                          <SelectItem value={value} disabled={hasImagesInConversation && MODELS_WITHOUT_IMAGE_SUPPORT.includes(value)}>
                            {label}
                          </SelectItem>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={15}>
                        <p className="max-w-xs">Your chat history has images, but this model does not support image inputs. Please select a different model.</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </TooltipProvider>
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
      <ScrollArea className="mb-2 grow rounded-md border p-4" ref={scrollAreaRef}>
        {conversation.map((m: any, i: number) => (
          <div key={m.id ?? i} className="mr-6 whitespace-pre-wrap md:mr-12">
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
                  <AvatarFallback className="bg-emerald-500 text-white">eAI</AvatarFallback>
                </Avatar>
                <div className="mt-1.5 w-full">
                  <div className="flex justify-between">
                    <p className="font-semibold opacity-70">edureteAI</p>
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
              disabled={isPending || !!uploadedImage || MODELS_WITHOUT_IMAGE_SUPPORT.includes(model)}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {uploadedImage && (
              <div className="relative h-9 w-9">
                <img src={uploadedImage} alt="uploaded image" className="h-full w-full object-cover rounded-sm" />
                <div onClick={handleDeleteImage} className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer bg-slate-700 rounded-full">
                  <X className="h-4 w-4 text-emerald-500 m-1" />
                </div>
              </div>
            )}
            <Button size="icon" type="submit" variant="secondary" disabled={isPending || (content.trim() === "" && !uploadedImage)} className="h-8 w-10">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin text-emerald-500" /> : <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
