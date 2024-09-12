"use server";

import { createAI, createStreamableValue, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";
import { checkQuota, saveChat, saveUsage } from "@/lib/actions";
import { Message } from "ai";
import { Chat, Usage } from "@/lib/types";
import { ReactNode } from "react";
import { handleModelProvider } from "@/lib/utils";
import { BotMessage } from "@/components/bot-message";

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

export async function submitUserMessage({ content, model, system }: { content: string; model: string; system: string }) {
  const aiState = getMutableAIState<typeof AI>();

  const hasQuotaAvailable = await checkQuota(aiState.get().userId!, aiState.get().model);

  if (!hasQuotaAvailable) {
    return {
      error: "You have exceeded your quota. Please contact support.",
    };
  }

  aiState.update({
    ...aiState.get(),
    model,
    system,
    messages: [
      ...aiState.get().messages,
      {
        id: uuidv4(),
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
                id: uuidv4(),
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
      onFinish: async (result) => {
        const usageData: Usage = {
          userId: aiState.get().userId!,
          model: aiState.get().model,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          timestamp: new Date(),
        };

        await saveUsage(usageData);
      },
    });

    return {
      //id: uuidv4(),
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
      const { userId, chatId, chatAreaId, messages, model, system } = state;

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
