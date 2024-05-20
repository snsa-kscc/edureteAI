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
