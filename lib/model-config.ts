import { ModelPricing } from "@/types/types";

export const MODEL_CONFIGS: Record<string, ModelPricing> = {
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
