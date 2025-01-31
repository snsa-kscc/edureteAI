import { ModelPricing } from "@/types";

export const MODEL_CONFIGS: Record<string, ModelPricing> = {
  "gemini-1.5-pro": {
    inputPrice: 1.25,
    outputPrice: 5,
    family: "google",
  },
  "gemini-2.0-flash-exp": {
    inputPrice: 0,
    outputPrice: 0,
    family: "google",
  },
  "deepseek-ai/DeepSeek-R1": {
    inputPrice: 7,
    outputPrice: 7,
    family: "togetherai",
  },
  "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free": {
    inputPrice: 0,
    outputPrice: 0,
    family: "togetherai",
  },
  "deepseek-ai/DeepSeek-V3": {
    inputPrice: 1.25,
    outputPrice: 1.25,
    family: "togetherai",
  },
  "o1-preview": {
    inputPrice: 15.0,
    outputPrice: 60.0,
    family: "openai",
  },
  "o1-mini": {
    inputPrice: 3.0,
    outputPrice: 12.0,
    family: "openai",
  },
  "gpt-4o": {
    inputPrice: 2.5,
    outputPrice: 10.0,
    family: "openai",
  },
  "gpt-4o-mini": {
    inputPrice: 0.15,
    outputPrice: 0.6,
    family: "openai",
  },
  "claude-3-5-sonnet-20241022": {
    inputPrice: 3.0,
    outputPrice: 15.0,
    family: "anthropic",
  },
  "claude-3-5-haiku-20241022": {
    inputPrice: 1.0,
    outputPrice: 5.0,
    family: "anthropic",
  },
  "claude-3-opus-20240229": {
    inputPrice: 15.0,
    outputPrice: 75.0,
    family: "anthropic",
  },
  "claude-3-sonnet-20240229": {
    inputPrice: 3.0,
    outputPrice: 15.0,
    family: "anthropic",
  },
  "claude-3-haiku-20240307": {
    inputPrice: 0.25,
    outputPrice: 1.25,
    family: "anthropic",
  },
};
