import { createAI, getAIState } from "ai/rsc";
import { submitUserMessage } from "@/app/actions";
import { saveChat } from "@/lib/redis-actions";
import { Chat, AIState, UIState } from "@/lib/types";

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
      // 2DO - title refactor
      //const title = messages[0].content.substring(0, 100);

      const chat: Chat = {
        ...(chatAreaId === "left"
          ? { leftMessages: messages, leftModel: model, leftSystemPrompt: system }
          : { rightMessages: messages, rightModel: model, rightSystemPrompt: system }),
        id: chatId,
        title: "untitled", // 2DO - title refactor
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
