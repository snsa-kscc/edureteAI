export const CHAT_MODELS = [
  { value: "accounts/fireworks/models/deepseek-r1", label: "Deepseek/DeepSeek R1" },
  { value: "gemini-2.5-pro-preview-03-25", label: "Google/Gemini 2.5 Pro Preview" },
  { value: "gemini-2.5-flash-preview-04-17", label: "Google/Gemini 2.5 Flash Preview" },
  { value: "gemini-2.0-flash", label: "Google/Gemini 2.0 Flash" },
  { value: "gpt-4o", label: "OpenAI/GPT-4o" },
  { value: "o4-mini", label: "OpenAI/o4-mini (high)" },
  { value: "claude-sonnet-4-20250514", label: "Anthropic/Claude Sonnet 4" },
  { value: "gpt-4.1", label: "OpenAI/GPT-4.1" },
  { value: "gpt-4.1-mini", label: "OpenAI/GPT-4.1-mini" },
  { value: "gpt-4.1-nano", label: "OpenAI/GPT-4.1-nano" },
];

export const MODELS_WITHOUT_IMAGE_SUPPORT = ["o1-preview", "o1-mini", "o3-mini", "accounts/fireworks/models/deepseek-r1", "deepseek-ai/DeepSeek-R1"];

export const DEFAULT_LEFT_MODEL = "o4-mini";
export const DEFAULT_RIGHT_MODEL = "gemini-2.5-flash-preview-04-17";
export const DEFAULT_USER_SYSTEM_PROMPT = "";
