"use server";

import { ReactNode } from "react";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";
import { checkQuota, saveUsage } from "@/lib/redis-actions";
import { Usage } from "@/lib/types";
import { handleModelProvider } from "@/lib/utils";
import { BotMessage } from "@/components/bot-message";
import { AI } from "@/app/ai";

export async function submitUserMessage({ content, model, system }: { content: string; model: string; system: string }) {
  const aiState = getMutableAIState<typeof AI>();

  const hasQuotaAvailable = await checkQuota(aiState.get().userId!, aiState.get().model);

  if (!hasQuotaAvailable) {
    return {
      error: "You have exceeded your quota. Please contact support.",
    };
  }

  const messageContent = [
    { type: "text", text: content },
    {
      type: "image",
      image: "https://www.w3schools.com/html/img_girl.jpg", // 2DO - hardcode removal
    },
  ];

  aiState.update({
    ...aiState.get(),
    model,
    system,
    messages: [
      //@ts-ignore
      ...aiState.get().messages,
      {
        id: uuidv4(),
        role: "user",
        //@ts-ignore
        content: messageContent,
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
