import { CHAT_MODELS, MODELS_WITHOUT_IMAGE_SUPPORT } from "@/lib/chat-config";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatSettingsProps {
  model: string;
  system: string | undefined;
  onModelChange: (value: string) => void;
  onSystemChange: (value: string) => void;
  hasImagesInConversation: boolean;
}

export function ChatSettings({ model, system, onModelChange, onSystemChange, hasImagesInConversation }: ChatSettingsProps) {
  return (
    <div className="flex justify-between">
      <Select onValueChange={onModelChange} value={model}>
        <SelectTrigger className="max-w-72 mb-2">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Models</SelectLabel>
            {CHAT_MODELS.map(({ value, label }) => (
              <SelectItem key={value} value={value} disabled={hasImagesInConversation && MODELS_WITHOUT_IMAGE_SUPPORT.includes(value)}>
                {label}
              </SelectItem>
            ))}
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
          <Textarea className="p-2 h-48" value={system || ""} onChange={(e) => onSystemChange(e.target.value)} placeholder="Enter a system prompt" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
