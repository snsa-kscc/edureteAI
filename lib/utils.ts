import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleModelProvider(model: string) {
  if (model.startsWith("gpt")) {
    return openai(model);
  } else {
    return anthropic(model);
  }
}

export function tokensToDollars(tokens: number) {
  return tokens / 66_666;
}

export function dollarsToTokens(dollars: number) {
  return dollars * 66_666;
}
