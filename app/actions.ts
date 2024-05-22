"use server";

import { createAI, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { saveChat } from "@/lib/actions";
import { Message } from "ai";
import { Chat } from "@/lib/types";
import { ReactNode } from "react";

export async function updateDbItem(id: string) {
  const { userId } = auth();
  return { myid: userId, id };
}

export type AIState = {
  chatId: string;
  model: string;
  systemPrompt: string;
  chatAreaId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}[];

const { model, systemPrompt } = {
  model: "gpt-3.5-turbo",
  systemPrompt: `You are a math solver. You are solving math questions and give you an answer. You must use math symbols and be precise. You must not use LaTeX in your responses.`,
};

export async function submitUserMessage(content: string) {
  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    model,
    systemPrompt,
    messages: [
      ...aiState.get().messages,
      {
        id: randomUUID(),
        role: "user",
        content,
      },
    ],
  });

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    system: `You are a reasoning AI tasked with solving the user's math-based questions. Logically arrive at the solution, and be factual. In your answers, clearly detail the steps involved and give the final answer. If you can't solve the question, say "I don't know". When responding with math formulas in the response, you must write the formulae using only Unicode from the Mathematical Operators block and other Unicode symbols. The AI GUI render engine does not support TeX code. You must not use LaTeX in responses.`,

    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
      })),
    ],

    text: ({ content, done }) => {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: randomUUID(),
              role: "assistant",
              content,
            },
          ],
        });
      }

      return content;
    },
  });

  return {
    id: randomUUID(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  onSetAIState: async ({ state, done }) => {
    if (done) {
      const { chatId, chatAreaId, messages, model, systemPrompt } = state;

      const { userId } = auth();
      const createdAt = new Date();
      const path = `/foo/${chatId}`;
      const title = messages[0].content.substring(0, 100);

      const chat: Chat = {
        ...(chatAreaId === "left"
          ? { leftMessages: messages, leftModel: model, leftSystemPrompt: systemPrompt }
          : { rightMessages: messages, rightModel: model, rightSystemPrompt: systemPrompt }),
        id: chatId,
        title,
        userId: userId!,
        createdAt,
        path,
      };

      await saveChat(chat);
    } else {
      return;
    }
  },
  onGetUIState: async () => {
    const aiState: AIState = getAIState<typeof AI>();

    return aiState.messages.map((message: any) => ({
      id: message.id,
      role: message.role,
      display: message.content,
    }));
  },
});
