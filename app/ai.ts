import { createAI, getAIState } from "ai/rsc";
import { submitUserMessage } from "@/app/actions";
import { saveChat } from "@/lib/redis-actions";
import { Chat, AIState, UIState, MessageContent } from "@/lib/types";

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";
    if (done) {
      const { userId, chatId, chatAreaId, messages, model, system } = state;

      const createdAt = new Date();
      const path = `/c/${chatId}`;

      const firstMessage = messages[0];
      let title = "untitled";

      if (firstMessage) {
        if (Array.isArray(firstMessage.content)) {
          const textContent = firstMessage.content
            .map((item: MessageContent) => (item.type === "text" ? item.text : ""))
            .join("\n")
            .trim();
          title = textContent.substring(0, 100);
        } else {
          title = firstMessage.content.substring(0, 100);
        }
      }

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
    "use server";
    const aiState: AIState = getAIState<typeof AI>();

    return aiState.messages.map((message: any) => ({
      id: message.id,
      role: message.role,
      content: message.content,
    }));
  },
});
