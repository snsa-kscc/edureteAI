"use client";

import { useState } from "react";
import { ClientMessage } from "../actions";
import { useActions, useUIState } from "ai/rsc";
import { randomUUID } from "crypto";

export default function Foo() {
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
    </div>
  );
}
