"use client";

import { useState, useRef, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatForm } from "@/components/chat/chat-form";
import { ChatSettings } from "@/components/chat/chat-settings";
import { GraphExamples } from "@/components/chat/graph-examples";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/upload-actions";
import { CHAT_MODELS, MODELS_WITHOUT_IMAGE_SUPPORT, DEFAULT_LEFT_MODEL, DEFAULT_RIGHT_MODEL } from "@/lib/chat-config";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import type { Message as LocalMessage } from "@/types";

export function Chat({
  isOwner,
  userId,
  userName,
  id,
  chatAreaId,
  initialModel,
  initialSystem,
  initialMessages,
}: {
  isOwner: boolean;
  userId: string | undefined;
  userName: string | null | undefined;
  id: string;
  chatAreaId: "left" | "right";
  initialModel: string;
  initialSystem?: string;
  initialMessages?: LocalMessage[];
}) {
  const router = useRouter();
  const [model, setModel] = useState(() => {
    const isValidModel = CHAT_MODELS.some((m) => m.value === initialModel);
    const defaultModel = chatAreaId === "left" ? DEFAULT_LEFT_MODEL : DEFAULT_RIGHT_MODEL;
    return isValidModel ? initialModel : defaultModel;
  });
  const [system, setSystem] = useState<string | undefined>(initialSystem);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [_, setNewChatId] = useLocalStorage("newChatId", id);
  const [userScrolled, setUserScrolled] = useState(false);
  const [initialMessagesCount, setInitialMessagesCount] = useState<number | null>(null);

  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
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

  useEffect(() => {
    if (initialMessagesCount === null && messages.length > 0) {
      setInitialMessagesCount(messages.length);
      return;
    }
    if (initialMessagesCount !== null && messages.length > initialMessagesCount && messages.length % 2 === 0 && status === "ready") {
      router.refresh();
    }
  }, [messages, status, initialMessagesCount]);

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
          toast.success("Slika je obrisana");
        } else {
          throw new Error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Greška pri brisanju slike");
      }
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, {
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

  const handleExampleClick = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>);
  };

  const hasLegacyImagesInConversation = messages.some((m) => Array.isArray(m.content) && m.content.some((c) => c.type === "image"));
  const hasImagesInConversation =
    hasLegacyImagesInConversation || messages.some((m) => m.experimental_attachments?.some((a) => a.contentType?.startsWith("image/*")));

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (status === "streaming" || isPending || !!uploadedImage || MODELS_WITHOUT_IMAGE_SUPPORT.includes(model)) {
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        handleImageUpload(fakeEvent);
      }
    },
    [status, isPending, uploadedImage, model, handleImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled: status === "streaming" || isPending || !!uploadedImage || MODELS_WITHOUT_IMAGE_SUPPORT.includes(model),
  });

  useEffect(() => {
    if (error) {
      if (error.message.includes("Failed to fetch")) {
        toast.error("Greška u povezivanju sa serverom. Molimo provjerite vašu internet vezu.");
      } else if (error.message.includes("Too many requests")) {
        toast.error("Previše zahtjeva. Molimo pričekajte nekoliko trenutaka.");
      } else {
        toast.error(`Opis greške: ${error.message}`);
      }
    }
  }, [error]);

  return (
    <div {...getRootProps()} className={`basis-1/2 p-4 relative flex flex-col lg:h-full h-screen ${isDragActive ? "bg-emerald-50/10" : ""}`}>
      {isDragActive && (
        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-emerald-500">
          <p className="text-emerald-700 font-medium">Ubaci sliku ovdje...</p>
        </div>
      )}
      <input {...getInputProps()} />

      <ChatSettings
        model={model}
        system={system}
        onModelChange={setModel}
        onSystemChange={(value) => setSystem(value)}
        hasImagesInConversation={hasImagesInConversation}
      />

      <ChatMessages ref={scrollAreaRef} messages={messages} userName={isOwner ? userName : "Korisnik"} status={status} />
      {isOwner && messages.length === 0 && (
        <GraphExamples onExampleClick={handleExampleClick} />
      )}
      {isOwner && (
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
      )}
    </div>
  );
}
