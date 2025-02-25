import { streamText, Message, appendResponseMessages } from "ai";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { handleModelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
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
  try {
    const { messages, id, userId, model, system, chatAreaId }: ChatRequest = await req.json();
    const hasQuotaAvailable = await checkQuota(userId, model);

    if (!hasQuotaAvailable) {
      return Response.json({ error: "You have exceeded your quota. Please contact support.", status: 429 });
    }

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    const content = currentMessage.experimental_attachments?.some((attachment) => attachment.contentType?.startsWith("image/"))
      ? [
          { type: "text", text: currentMessage.content.trim() || "Analiziraj sliku." },
          ...currentMessage.experimental_attachments
            .filter((attachment) => attachment.contentType?.startsWith("image/"))
            .map((attachment) => ({
              type: "image",
              image: new URL(attachment.url),
            })),
        ]
      : currentMessage.content.trim();

    const result = streamText({
      model: handleModelProvider(model),
      system: ["o1-mini", "o1-preview"].includes(model) ? undefined : DEFAULT_SYSTEM_PROMPT + "\n" + system,
      messages: [
        ...initialMessages,
        {
          role: "user",
          content,
        } as Message,
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
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred while processing your request", status: 500 });
  }
}
