import { streamText } from "ai";
import { checkQuota, saveUsage } from "@/lib/neon-actions";
import { handleModelProvider } from "@/lib/utils";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/model-config";
import { saveChat } from "@/lib/redis-actions";
import type { Usage, Chat } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, id, userId, model, system, chatAreaId } = await req.json();

    const hasQuotaAvailable = await checkQuota(userId, model);

    if (!hasQuotaAvailable) {
      return Response.json({ error: "You have exceeded your quota. Please contact support.", status: 429 });
    }

    const result = streamText({
      model: handleModelProvider(model),
      system: ["o1-mini", "o1-preview"].includes(model) ? undefined : DEFAULT_SYSTEM_PROMPT + "\n" + system,
      messages,
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

        const chat: Chat = {
          id: uuidv4(),
          userId,
          ...(chatAreaId === "left"
            ? {
                leftMessages: [...messages, { role: "assistant", content: result.text }],
                leftModel: model,
                leftSystemPrompt: system,
              }
            : {
                rightMessages: [...messages, { role: "assistant", content: result.text }],
                rightModel: model,
                rightSystemPrompt: system,
              }),
          title: messages[0]?.content?.substring?.(0, 100) || "New Chat",
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
