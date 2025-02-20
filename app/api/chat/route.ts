import { streamText, UIMessage, Message, Attachment, CoreMessage, convertToCoreMessages } from "ai";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { handleModelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
import type { Usage, Chat } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

interface ChatRequest {
  messages: Message[];
  userId: string;
  model: string;
  system: string;
  chatAreaId: string;
}

// interface ExtendedMessage extends Omit<Message, "content"> {
//   content: string | Array<{ type: string; text?: string; image?: URL }>;
// }

export async function POST(req: Request) {
  try {
    const { messages, userId, model, system, chatAreaId }: ChatRequest = await req.json();

    // const hasQuotaAvailable = await checkQuota(userId, model);

    // if (!hasQuotaAvailable) {
    //   return Response.json({ error: "You have exceeded your quota. Please contact support.", status: 429 });
    // }

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    const content = currentMessage.experimental_attachments?.some((attachment) => attachment.contentType?.startsWith("image/"))
      ? [
          { type: "text", text: currentMessage.content },
          ...currentMessage.experimental_attachments
            .filter((attachment) => attachment.contentType?.startsWith("image/"))
            .map((attachment) => ({
              type: "image",
              image: new URL(attachment.url),
            })),
        ]
      : currentMessage.content;

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
        // await saveUsage(usageData);

        // const chat: Chat = {
        //   id: uuidv4(),
        //   userId,
        //   ...(chatAreaId === "left"
        //     ? {
        //         leftMessages: [...messages, { role: "assistant", content: result.text }],
        //         leftModel: model,
        //         leftSystemPrompt: system,
        //       }
        //     : {
        //         rightMessages: [...messages, { role: "assistant", content: result.text }],
        //         rightModel: model,
        //         rightSystemPrompt: system,
        //       }),
        //   title: messages[0]?.content?.substring?.(0, 100) || "New Chat",
        //   path: `/c/${id}`,
        //   createdAt: new Date(),
        // };
        // await saveChat(chat);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred while processing your request", status: 500 });
  }
}
