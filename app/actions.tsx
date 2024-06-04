"use server";

import { createAI, createStreamableValue, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { saveChat } from "@/lib/actions";
import { Message } from "ai";
import { Chat } from "@/lib/types";
import { ReactNode } from "react";
import { handleModelProvider } from "@/lib/utils";
import { BotMessage } from "@/components/bot-message";

export async function updateDbItem(id: string) {
  const { userId } = auth();
  return { myid: userId, id };
}

export type AIState = {
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

export async function submitUserMessage({ content, model, system }: { content: string; model: string; system: string }) {
  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    model,
    system,
    messages: [
      ...aiState.get().messages,
      {
        id: randomUUID(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | ReactNode;
  if (!textStream) {
    textStream = createStreamableValue("");
    textNode = <BotMessage content={textStream.value} />;
  }
  try {
    const result = await streamUI({
      model: handleModelProvider(aiState.get().model),
      system: aiState.get().system,
      messages: [
        ...aiState.get().messages.map((message: any) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      text: ({ content, done, delta }) => {
        // if (!textStream) {
        //   textStream = createStreamableValue("");
        //   textNode = <BotMessage content={textStream.value} />;
        // }

        if (done) {
          textStream.done();
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
        } else {
          textStream.update(delta);
        }

        return textNode;
      },
    });

    return {
      //id: randomUUID(),
      //role: "assistant",
      content: result.value,
      stream: textStream.value,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  onSetAIState: async ({ state, done }) => {
    if (done) {
      const { chatId, chatAreaId, messages, model, system } = state;

      const { userId } = auth();
      const createdAt = new Date();
      const path = `/c/${chatId}`;
      const title = messages[0].content.substring(0, 100);

      const chat: Chat = {
        ...(chatAreaId === "left"
          ? { leftMessages: messages, leftModel: model, leftSystemPrompt: system }
          : { rightMessages: messages, rightModel: model, rightSystemPrompt: system }),
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
      content: message.content,
    }));
  },
});
