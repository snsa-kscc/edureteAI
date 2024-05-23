"use client";

import { ReactNode, useState } from "react";
import { useActions, useUIState } from "ai/rsc";

interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export function RscChat({ defaultModel, defaultSystem }: { defaultModel: string; defaultSystem: string }) {
  const [content, setContent] = useState<string>("");
  const [model, setModel] = useState<string>(defaultModel);
  const [system, setSystem] = useState<string>(defaultSystem);
  const [conversation, setConversation] = useUIState();
  const { submitUserMessage } = useActions();

  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />
        <button
          disabled={!content}
          onClick={async () => {
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: Math.random().toString(), role: "user", display: content },
            ]);
            const message = await submitUserMessage({ content, model, system });
            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, message]);
          }}
        >
          Send Message
        </button>
      </div>
      <div>
        <input value={model} onChange={(event) => setModel(event.target.value)} type="text" />
        <button>Set model</button>
      </div>
      <div>
        <input value={system} onChange={(event) => setSystem(event.target.value)} type="text" />
        <button>Set system prompt</button>
        <p>{JSON.stringify({ model, system }, null, 2)}</p>
      </div>
    </div>
  );
}
