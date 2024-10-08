import { Message } from "ai";

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
