"use client";

import { useChat } from "@ai-sdk/react";

interface SimpleChatProps {
  params: {
    id: string;
  };
}

const MODEL_MAPPING: { [key: string]: string } = {
  "1": "accounts/fireworks/models/deepseek-r1",
  "2": "gemini-1.5-pro",
  "3": "gemini-2.0-flash",
  "4": "deepseek-ai/DeepSeek-R1",
  "5": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
  "6": "deepseek-ai/DeepSeek-V3",
  "7": "o3-mini",
  "8": "o1-preview",
  "9": "o1-mini",
  "10": "gpt-4o",
  "11": "gpt-4o-mini",
  "12": "claude-3-5-sonnet-20241022",
  "13": "claude-3-5-haiku-20241022",
  "14": "claude-3-opus-20240229",
  "15": "claude-3-sonnet-20240229",
  "16": "claude-3-haiku-20240307",
};

export function SimpleChat({ params: { id } }: SimpleChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      model: MODEL_MAPPING[id] || MODEL_MAPPING["1"],
    },
    initialMessages: [],
  });
  return (
    <div className="flex flex-col container py-8 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
