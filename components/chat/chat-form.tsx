import { useRef } from "react";
import Image from "next/image";
import { Loader2, SendHorizontalIcon, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEnterSubmit } from "@/hooks/use-enter-submit";

interface ChatFormProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
  uploadedImage: string | null;
  isLoading: boolean;
  isImageUploadDisabled: boolean;
}

export function ChatForm({ input, onInputChange, onSubmit, onImageUpload, onDeleteImage, uploadedImage, isLoading, isImageUploadDisabled }: ChatFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative">
      <Textarea
        value={input}
        onChange={onInputChange}
        onKeyDown={(e) => onKeyDown(e, !!uploadedImage)}
        placeholder="Ask me anything..."
        className={`placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 ${uploadedImage ? "pr-40" : "pr-28"}`}
        disabled={isLoading}
      />
      <div className="flex items-center gap-3 mb-2 absolute bottom-2 right-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="text-emerald-500 h-8 w-10"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || !!uploadedImage || isImageUploadDisabled}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
        {uploadedImage && (
          <div className="relative h-9 w-9">
            <Image src={uploadedImage || "/placeholder.svg"} alt="uploaded image" className="h-full w-full object-cover rounded-sm" width={32} height={32} />
            <div onClick={onDeleteImage} className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer bg-slate-700 rounded-full">
              <X className="h-4 w-4 text-emerald-500 m-1" />
            </div>
          </div>
        )}
        <Button size="icon" type="submit" variant="secondary" disabled={isLoading || (!uploadedImage && input.trim() === "")} className="h-8 w-10">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-emerald-500" /> : <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />}
        </Button>
      </div>
    </form>
  );
}
