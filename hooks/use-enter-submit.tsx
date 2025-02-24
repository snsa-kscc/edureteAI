import { useRef, type RefObject } from "react";

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>, hasImage?: boolean) => void;
} {
  const formRef = useRef<HTMLFormElement>(null!) as RefObject<HTMLFormElement>;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, hasImage?: boolean): void => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && (hasImage || event.currentTarget.value.trim() !== "")) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: handleKeyDown };
}
