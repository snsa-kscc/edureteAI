"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/use-image-upload";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/upload-actions";
import type { Message as LocalMessage } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from "next/navigation";
import { ChatMessages } from "./chat/chat-messages";
import { ChatForm } from "./chat/chat-form";
import { ChatSettings } from "./chat/chat-settings";
import { CHAT_MODELS, MODELS_WITHOUT_IMAGE_SUPPORT } from "@/lib/chat-config";

export function Chat({
  userId,
  id,
  chatAreaId,
  initialModel,
  initialSystem,
  initialMessages,
}: {
  userId: string | undefined;
  id: string;
  chatAreaId: "left" | "right";
  initialModel: string;
  initialSystem?: string;
  initialMessages?: LocalMessage[];
}) {
  const router = useRouter();
  const [model, setModel] = useState(() => {
    const isValidModel = CHAT_MODELS.some((m) => m.value === initialModel);
    return isValidModel ? initialModel : "gemini-2.0-flash";
  });
  const [system, setSystem] = useState<string | undefined>(initialSystem);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [_, setNewChatId] = useLocalStorage("newChatId", id);
  const [userScrolled, setUserScrolled] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    // @ts-ignore - required because of legacy code how handling pictures was implemented
    initialMessages,
    sendExtraMessageFields: true,
    body: {
      id,
      userId,
      model,
      system,
      chatAreaId,
    },
  });

  useEffect(() => {
    setNewChatId(id);
  }, []);

  // useEffect(() => {
  //   const messagesLength = messages?.length;
  //   if (messagesLength % 2 === 0 && messagesLength > 0) {
  //     router.refresh();
  //   }
  // }, [messages, router]);

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
  }, [messages.length % 2 === 0]);

  useEffect(() => {
    if (scrollAreaRef.current === null || userScrolled) return;
    scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
  }, [messages, userScrolled]);

  const { handleImageUpload } = useImageUpload({
    onImageUpload: (url) => {
      setUploadedImage(url);
    },
    uploadFileToR2,
    startTransition,
    disabled: status === "streaming" || isPending || !!uploadedImage || MODELS_WITHOUT_IMAGE_SUPPORT.includes(model),
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const messageText = input.trim() === "" && uploadedImage ? "Analize picture" : input;

    handleSubmit(e, {
      data: { text: messageText + "bla" },
      allowEmptySubmit: true,
      experimental_attachments: uploadedImage
        ? [
            {
              name: uploadedImage,
              contentType: "image/*",
              url: uploadedImage,
            },
          ]
        : undefined,
    });

    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasLegacyImagesInConversation = messages.some((m) => Array.isArray(m.content) && m.content.some((c) => c.type === "image"));
  const hasImagesInConversation =
    hasLegacyImagesInConversation || messages.some((m) => m.experimental_attachments?.some((a) => a.contentType?.startsWith("image/*")));

  return (
    <div className="w-full p-4 flex flex-col h-[80vh]">
      <ChatSettings
        model={model}
        system={system}
        onModelChange={setModel}
        onSystemChange={(value) => setSystem(value)}
        hasImagesInConversation={hasImagesInConversation}
      />

      <ChatMessages ref={scrollAreaRef} messages={messages} />

      <ChatForm
        input={input}
        onInputChange={handleInputChange}
        onSubmit={onSubmit}
        onImageUpload={handleImageUpload}
        onDeleteImage={handleDeleteImage}
        uploadedImage={uploadedImage}
        isLoading={status === "streaming" || isPending}
        isImageUploadDisabled={MODELS_WITHOUT_IMAGE_SUPPORT.includes(model)}
      />
    </div>
  );
}
