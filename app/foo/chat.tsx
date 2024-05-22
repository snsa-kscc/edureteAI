"use client";

import { ReactNode, useState } from "react";
import { useActions, useUIState } from "ai/rsc";

interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export default function FooChat({ model, system }: { model: string; system: string }) {
  const [input, setInput] = useState<string>("");
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
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button
          onClick={async () => {
            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, { id: Math.random().toString(), role: "user", display: input }]);
            const message = await submitUserMessage(input);
            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, message]);
          }}
        >
          Send Message
        </button>
      </div>
      <div>
        {/* 2DO send mutated model and system to server */}
        <input readOnly value={model} type="text" />
        <button>Set model</button>
      </div>
      <div>
        <input readOnly value={system} type="text" />
        <button>Set system prompt</button>
      </div>
    </div>
  );
}
