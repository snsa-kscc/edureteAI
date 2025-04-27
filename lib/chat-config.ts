export const CHAT_MODELS = [
  { value: "accounts/fireworks/models/deepseek-r1", label: "Deepseek/DeepSeek R1" },
  { value: "gemini-2.5-pro-preview-03-25", label: "Google/Gemini 2.5 Pro Preview" },
  { value: "gemini-2.0-flash", label: "Google/Gemini 2.0 Flash" },
  { value: "gpt-4o", label: "OpenAI/GPT-4o" },
  { value: "o4-mini", label: "OpenAI/o4-mini (high)" },
  { value: "claude-3-7-sonnet-latest", label: "Anthropic/Claude 3.7 Sonnet" },
];

export const MODELS_WITHOUT_IMAGE_SUPPORT = ["o1-preview", "o1-mini", "o3-mini", "accounts/fireworks/models/deepseek-r1", "deepseek-ai/DeepSeek-R1"];

export const DEFAULT_LEFT_MODEL = "gemini-2.5-pro-preview-03-25";
export const DEFAULT_RIGHT_MODEL = "gpt-4o";
export const DEFAULT_USER_SYSTEM_PROMPT = "";
