import { useEffect, startTransition } from "react";
import { toast } from "sonner";

interface UseImageUploadProps {
  onImageUpload: (url: string | null) => void;
  uploadFileToR2: (formData: FormData) => Promise<{ success: boolean; url?: string }>;
  startTransition: typeof startTransition;
  maxSize?: number;
  disabled?: boolean;
}

export function useImageUpload({ onImageUpload, uploadFileToR2, startTransition, maxSize = 4 * 1024 * 1024, disabled = false }: UseImageUploadProps) {
  const canUploadImage = !disabled;

  const handleImage = async (file: File) => {
    if (!canUploadImage) {
      toast.error("Image upload is not available with the current settings");
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const { success, url } = await uploadFileToR2(formData);
        if (success && url) {
          onImageUpload(url);
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload image");
      }
    });
  };

  useEffect(() => {
    if (!canUploadImage) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            await handleImage(file);
            break;
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [canUploadImage]);

  return {
    handleImageUpload: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleImage(file);
      }
    },
  };
}
