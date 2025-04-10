import { NextResponse } from "next/server";
import { streamText, type Message, appendResponseMessages, createDataStreamResponse, smoothStream } from "ai";
import { auth } from "@clerk/nextjs/server";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { modelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
import { checkMessageAvailability, incrementMessageCount } from "@/lib/message-limits";
import type { Usage, Chat } from "@/types";

export const runtime = "edge";

interface ChatRequest {
  messages: Message[];
  id: string;
  userId: string;
  model: string;
  system: string;
  chatAreaId: string;
}

export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;

  if (!userId) {
    return new NextResponse("Niste autorizirani!", { status: 401 });
  }

  try {
    const { messages, id, userId, model, system, chatAreaId }: ChatRequest = await req.json();

    const messageAvailability = await checkMessageAvailability(userId, model);
    if (!messageAvailability.hasAvailability) {
      return new NextResponse("Došli ste do limita!", { status: 429 });
    }

    const hasQuotaAvailable = await checkQuota(userId, model);
    if (!hasQuotaAvailable) {
      return new NextResponse("Došli ste do limita!", { status: 429 });
    }

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    const content = currentMessage.experimental_attachments?.some((attachment) => attachment.contentType?.startsWith("image/"))
      ? [
          { type: "text", text: currentMessage.content.trim() || "Analiziraj sliku." },
          ...currentMessage.experimental_attachments
            .filter((attachment) => attachment.contentType?.startsWith("image/"))
            .map((attachment) => {
              return {
                type: "image",
                image: new URL(attachment.url),
              };
            }),
        ]
      : currentMessage.content.trim();

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: modelProvider.languageModel(model),
          system: ["o1-mini", "o1-preview"].includes(model) ? undefined : DEFAULT_SYSTEM_PROMPT + "\n" + system,
          messages: [
            ...initialMessages,
            {
              role: "user",
              content,
            } as Message,
          ],
          experimental_transform: [
            smoothStream({
              chunking: "word",
            }),
          ],
          onFinish: async (result) => {
            const usageData: Usage = {
              userId,
              model,
              promptTokens: result.usage.promptTokens,
              completionTokens: result.usage.completionTokens,
              totalTokens: result.usage.totalTokens,
              timestamp: new Date(),
            };

            await incrementMessageCount(userId, model);
            await saveUsage(usageData);

            const combinedMessages = appendResponseMessages({ messages, responseMessages: result.response.messages });
            const chat: Chat = {
              id,
              userId,
              ...(chatAreaId === "left"
                ? {
                    leftMessages: combinedMessages,
                    leftModel: model,
                    leftSystemPrompt: system,
                  }
                : {
                    rightMessages: combinedMessages,
                    rightModel: model,
                    rightSystemPrompt: system,
                  }),
              title: messages[0]?.content?.substring?.(0, 100) || "Novi razgovor",
              path: `/c/${id}`,
              createdAt: new Date(),
            };
            await saveChat(chat);
          },
          onError: async (error) => {
            console.error("Error in onFinish callback:", error);
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream, { sendReasoning: true });
      },
      onError: () => {
        return "Greška prilikom obrade zahtjeva!";
      },
    });
  } catch (error) {
    return new NextResponse("Failed to process request.", { status: 500 });
  }
}
