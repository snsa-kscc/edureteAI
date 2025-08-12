export const CHAT_MODELS = [
  { value: "accounts/fireworks/models/deepseek-r1", label: "Deepseek/DeepSeek R1" },
  { value: "gemini-2.5-pro", label: "Google/Gemini 2.5 Pro" },
  { value: "gemini-2.5-flash", label: "Google/Gemini 2.5 Flash" },
  { value: "gpt-5", label: "OpenAI/GPT-5" },
  { value: "gpt-5-mini", label: "OpenAI/GPT-5 mini" },
  { value: "gpt-5-nano", label: "OpenAI/GPT-5 nano" },
  { value: "claude-opus-4-1-20250805", label: "Anthropic/Claude Opus 4.1" },
  { value: "claude-sonnet-4-20250514", label: "Anthropic/Claude Sonnet 4" },
  { value: "claude-sonnet-4-thinking", label: "Anthropic/Claude Sonnet 4 (Thinking)" },

];

export const MODELS_WITHOUT_IMAGE_SUPPORT = ["o1-preview", "o1-mini", "o3-mini", "accounts/fireworks/models/deepseek-r1", "deepseek-ai/DeepSeek-R1"];

export const DEFAULT_LEFT_MODEL = "gemini-2.5-pro";
export const DEFAULT_RIGHT_MODEL = "claude-sonnet-4-20250514";
export const DEFAULT_USER_SYSTEM_PROMPT = "";
