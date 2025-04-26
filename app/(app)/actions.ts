"use server";

import { streamText } from "ai";
import { createStreamableValue, getMutableAIState } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { handleModelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { AI } from "@/app/(app)/ai";
import type { Usage, MessageContent } from "@/types";

export async function submitUserMessage({ content, model, system }: { content: MessageContent[]; model: string; system: string }) {
  const aiState = getMutableAIState<typeof AI>();

  // const hasQuotaAvailable = await checkQuota(aiState.get().userId!, aiState.get().model);

  // if (!hasQuotaAvailable) {
  //   return {
  //     error: "You have exceeded your quota. Please contact support.",
  //   };
  // }

  let messageContent: MessageContent[];

  if (typeof content === "string") {
    messageContent = [{ type: "text", text: content }];
  } else {
    messageContent = content;
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
        content: messageContent,
      },
    ],
  });

  const stream = createStreamableValue("");
  try {
    (async () => {
      const { textStream } = streamText({
        model: handleModelProvider(aiState.get().model),
        system: ["o1-mini", "o1-preview"].includes(aiState.get().model) ? undefined : DEFAULT_SYSTEM_PROMPT + "\n" + aiState.get().system,
        messages: [
          ...aiState.get().messages.map((message: any) => ({
            role: message.role,
            content: message.content,
          })),
        ],
        onFinish: async (result) => {
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: uuidv4(),
                role: "assistant",
                content: result.text,
              },
            ],
          });

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

      for await (const chunk of textStream) {
        stream.update(chunk);
      }

      stream.done();
    })();

    return {
      stream: stream.value,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
