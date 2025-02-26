export const CHAT_MODELS = [
  { value: "accounts/fireworks/models/deepseek-r1", label: "Deepseek/DeepSeek R1 via Fireworks" },
  { value: "deepseek-ai/DeepSeek-R1", label: "Deepseek/DeepSeek R1 via TogetherAI" },
  { value: "gemini-2.0-flash", label: "Google/Gemini 2.0 Flash" },
  { value: "gemini-2.0-flash-thinking-exp-01-21", label: "Google/Gemini 2.0 Flash Thinking Experimental" },
  { value: "o1-preview", label: "OpenAI/o1-preview" },
  { value: "o1-mini", label: "OpenAI/o1-mini" },
  { value: "gpt-4o", label: "OpenAI/GPT-4o" },
  { value: "gpt-4o-mini", label: "OpenAI/GPT-4o-mini" },
  { value: "claude-3-7-sonnet-latest", label: "Anthropic/Claude 3.7 Sonnet" },
  { value: "claude-3-5-sonnet-latest", label: "Anthropic/Claude 3.5 Sonnet" },
];

export const MODELS_WITHOUT_IMAGE_SUPPORT = ["o1-preview", "o1-mini", "accounts/fireworks/models/deepseek-r1", "deepseek-ai/DeepSeek-R1"];

export const DEFAULT_LEFT_MODEL = "gemini-2.0-flash";
export const DEFAULT_RIGHT_MODEL = "claude-3-7-sonnet-latest";
export const DEFAULT_USER_SYSTEM_PROMPT = "Write your answer in LaTeX notation.";
