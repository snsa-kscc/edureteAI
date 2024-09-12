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

export function tokensToDollars(tokens: number): number {
  return Number((tokens / 66_666).toFixed(4));
}

export function dollarsToTokens(dollars: number): number {
  return Math.round(dollars * 66_666);
}
