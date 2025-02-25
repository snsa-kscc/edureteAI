import { CHAT_MODELS, MODELS_WITHOUT_IMAGE_SUPPORT } from "@/lib/chat-config";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <SelectContent className="overflow-visible">
          <SelectGroup>
            <SelectLabel>Dostupni modeli</SelectLabel>
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
                      <p className="max-w-xs">Vaš razgovor sadrži slike, ali ovaj model ne podržava unos slika. Molimo odaberite drugi model.</p>
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
          <Textarea className="p-2 h-48" value={system || ""} onChange={(e) => onSystemChange(e.target.value)} placeholder="Unesi sistemsku uputu" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
