import { streamText, type Message, appendResponseMessages } from "ai";
import { auth } from "@clerk/nextjs/server";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { handleModelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
import { checkMessageAvailability, incrementMessageCount } from "@/lib/message-limits";
import type { Usage, Chat } from "@/types";
import type { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";

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
  console.log("[CHAT API] Request received");
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId;
  console.log("[CHAT API] User authentication:", { userId: userId || "Not authenticated" });

  if (!userId) {
    console.log("[CHAT API] Authentication failed: Unauthorized");
    return Response.json({ error: "Unauthorized", status: 401 });
  }

  try {
    console.log("[CHAT API] Parsing request body");
    const { messages, id, userId, model, system, chatAreaId }: ChatRequest = await req.json();
    console.log("[CHAT API] Request parsed:", { id, userId, model, chatAreaId, messageCount: messages.length });

    console.log("[CHAT API] Checking message availability");
    const messageAvailability = await checkMessageAvailability(userId, model);
    console.log("[CHAT API] Message availability result:", messageAvailability);
    if (!messageAvailability.hasAvailability) {
      console.log("[CHAT API] Message limit exceeded:", messageAvailability.message);
      return Response.json({ error: messageAvailability.message, status: 429 });
    }

    console.log("[CHAT API] Checking quota");
    const hasQuotaAvailable = await checkQuota(userId, model);
    console.log("[CHAT API] Quota check result:", { hasQuotaAvailable });
    if (!hasQuotaAvailable) {
      console.log("[CHAT API] Quota exceeded");
      return Response.json({ error: "You have exceeded your quota. Please contact support.", status: 429 });
    }

    console.log("[CHAT API] Processing messages");
    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];
    console.log("[CHAT API] Current message:", {
      content: typeof currentMessage.content === "string" ? currentMessage.content.substring(0, 50) + "..." : "Not a string",
      hasAttachments: !!currentMessage.experimental_attachments?.length,
    });

    console.log("[CHAT API] Processing content and attachments");
    let content;
    try {
      content = currentMessage.experimental_attachments?.some((attachment) => attachment.contentType?.startsWith("image/"))
        ? [
            { type: "text", text: currentMessage.content.trim() || "Analiziraj sliku." },
            ...currentMessage.experimental_attachments
              .filter((attachment) => attachment.contentType?.startsWith("image/"))
              .map((attachment) => {
                console.log("[CHAT API] Processing image attachment:", { url: attachment.url });
                return {
                  type: "image",
                  image: new URL(attachment.url),
                };
              }),
          ]
        : currentMessage.content.trim();
      console.log("[CHAT API] Content processed successfully", {
        contentType: Array.isArray(content) ? "multipart with images" : "text only",
        textLength: typeof content === "string" ? content.length : "N/A",
      });
    } catch (error) {
      console.error("[CHAT API] Error processing content:", error);
      throw error;
    }

    console.log("[CHAT API] Preparing to stream text with model:", model);
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
      providerOptions:
        model === "o3-mini"
          ? {
              openai: {
                reasoningEffort: "high",
              } satisfies OpenAIResponsesProviderOptions,
            }
          : {},
      onFinish: async (result) => {
        console.log("[CHAT API] Stream completed, processing results", {
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
        });
        const usageData: Usage = {
          userId,
          model,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          timestamp: new Date(),
        };

        console.log("[CHAT API] Incrementing message count and saving usage");
        try {
          await incrementMessageCount(userId, model);
          await saveUsage(usageData);
          console.log("[CHAT API] Message count and usage saved successfully");
        } catch (error) {
          console.error("[CHAT API] Error saving message count or usage:", error);
          throw error;
        }

        console.log("[CHAT API] Combining messages and preparing chat data");
        const combinedMessages = appendResponseMessages({ messages, responseMessages: result.response.messages });
        console.log("[CHAT API] Messages combined, total count:", combinedMessages.length);
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
        console.log("[CHAT API] Saving chat to database");
        try {
          await saveChat(chat);
          console.log("[CHAT API] Chat saved successfully");
        } catch (error) {
          console.error("[CHAT API] Error saving chat:", error);
          throw error;
        }
      },
    });
    console.log("[CHAT API] Returning stream response");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[CHAT API] Unhandled error:", error);
    console.error("[CHAT API] Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    return Response.json({ error: "An error occurred while processing your request", status: 500 });
  }
  console.log("[CHAT API] Request handling completed");
}
