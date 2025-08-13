import { NextResponse } from "next/server";
import { streamText, type UIMessage, convertToModelMessages, smoothStream } from "ai";
import { auth } from "@clerk/nextjs/server";
import { saveUsage } from "@/lib/neon-actions";
import { modelProvider } from "@/lib/utils";
import { getSystemPromptForModel } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
import { checkMessageAvailability, incrementMessageCount } from "@/lib/message-limits";
import { tools } from "@/lib/tools";
import type { Usage, Chat } from "@/types";

export const runtime = "edge";

interface ChatRequest {
  messages: UIMessage[];
  chatId: string;
  userId: string;
  model: string;
  systemMessage: string;
  chatAreaId: string;
}

export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;
  if (!userId) {
    return new NextResponse("Niste autorizirani!", { status: 401 });
  }

  try {
    const { messages, chatId, userId, model, systemMessage, chatAreaId }: ChatRequest = await req.json();

    const messageAvailability = await checkMessageAvailability(userId, model);
    if (!messageAvailability.hasAvailability) {
      return new NextResponse("Došli ste do limita!", { status: 429 });
    }

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    // Check if message has file parts with images
    const hasImageParts = currentMessage.parts?.some((part) => part.type === "file" && part.mediaType?.startsWith("image/"));

    const content = hasImageParts
      ? [
          {
            type: "text",
            text:
              typeof currentMessage.parts?.find((p) => p.type === "text")?.text === "string"
                ? currentMessage.parts.find((p) => p.type === "text")?.text?.trim() || "Analiziraj sliku."
                : "Analiziraj sliku.",
          },
          ...(currentMessage.parts
            ?.filter((part) => part.type === "file" && part.mediaType?.startsWith("image/"))
            .map((part) => ({
              type: "image" as const,
              image: new URL((part as any).url || ""),
            })) || []),
        ]
      : typeof currentMessage.parts?.find((p) => p.type === "text")?.text === "string"
      ? currentMessage.parts.find((p) => p.type === "text")?.text?.trim() || ""
      : "";

    const result = streamText({
      model: modelProvider.languageModel(model),
      system: getSystemPromptForModel(model) + "\n" + systemMessage,
      messages: convertToModelMessages([
        ...initialMessages,
        {
          id: crypto.randomUUID(),
          role: "user",
          parts: Array.isArray(content)
            ? content.map((item: any) =>
                item.type === "text"
                  ? { type: "text" as const, text: item.text }
                  : { type: "file" as const, url: (item as any).image?.toString() || "", mediaType: "image/jpeg" }
              )
            : [{ type: "text" as const, text: content }],
        } as UIMessage,
      ]),
      tools,
      experimental_transform: [
        smoothStream({
          chunking: "word",
        }),
      ],
      onFinish: async (result) => {
        const usageData: Usage = {
          userId,
          model,
          inputTokens: result.usage.inputTokens ?? 0,
          outputTokens: result.usage.outputTokens ?? 0,
          totalTokens: result.usage.totalTokens ?? 0,
          timestamp: new Date(),
        };

        await incrementMessageCount(userId, model);
        await saveUsage(usageData);
      },
      onError: async (error) => {
        console.error("Error in onFinish callback:", error);
      },
    });

    result.consumeStream();

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages: currentMessage }) => {
        // Extract title from first user message
        const firstMessage = messages[0];
        let title = "Novi razgovor";
        if (firstMessage?.parts) {
          const textPart = firstMessage.parts.find((p: any) => p.type === "text" && "text" in p);
          if (textPart && "text" in textPart) {
            title = (textPart as any).text.substring(0, 100);
          }
        }
        const allMessages = [...messages, ...currentMessage];

        const chat: Chat = {
          id: chatId,
          userId,
          ...(chatAreaId === "left"
            ? {
                leftMessages: allMessages,
                leftModel: model,
                leftSystemPrompt: systemMessage,
              }
            : {
                rightMessages: allMessages,
                rightModel: model,
                rightSystemPrompt: systemMessage,
              }),
          title,
          createdAt: new Date(),
          path: `/c/${chatId}`,
        };
        await saveChat(chat);
      },
    });
  } catch (error) {
    return new NextResponse("Failed to process request.", { status: 500 });
  }
}
