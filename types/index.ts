import { ReactNode } from "react";
import { UIMessage as AiMessage } from "ai";

export type MessageContent = {
  type: "text" | "image";
  text?: string;
  image?: string;
};

export type Message = Omit<AiMessage, "content"> & {
  content: string | MessageContent[];
};

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
}

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  leftMessages?: Message[];
  rightMessages?: Message[];
  leftModel?: string;
  rightModel?: string;
  leftSystemPrompt?: string | undefined;
  rightSystemPrompt?: string | undefined;
}

export type AIState = {
  userId: string | null | undefined;
  chatId: string;
  model: string;
  system: string | undefined;
  chatAreaId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
}[];

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export type Usage = {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  timestamp: Date;
};

export type UserQuota = {
  userId: string;
  totalTokensUsed: number;
  quotaLimit: number;
};

export type UserData = { userId: string; firstName: string; lastName: string; emailAddress: string };

export type ProviderData =
  | {
      userId: string;
      tokens: number;
      amount: number;
      limit: number;
    }
  | undefined;

export interface ModelPricing {
  inputPrice: number | ((tokens: number) => number);
  outputPrice: number | ((tokens: number) => number);
  family: "openai" | "anthropic" | "togetherai" | "google" | "fireworks";
};
