import { ReactNode } from "react";
import { Message as AiMessage } from "ai";

export type MessageContent = {
  type: "text" | "image";
  text?: string;
  image?: string;
};

type Message = Omit<AiMessage, "content"> & {
  content: string | MessageContent[];
};

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
  leftSystemPrompt?: string;
  rightSystemPrompt?: string;
}

export type AIState = {
  userId: string | null;
  chatId: string;
  model: string;
  system: string;
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
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: Date;
};

export type UserQuota = {
  userId: string;
  totalTokensUsed: number;
  quotaLimit: number;
};

export type ModelPricing = {
  inputPrice: number;
  outputPrice: number;
  family: "openai" | "anthropic";
};
