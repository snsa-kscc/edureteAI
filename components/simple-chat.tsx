"use client";

import { useChat } from "@ai-sdk/react";
import Image from "next/image";
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
  "17": "accounts/fireworks/models/mixtral-8x22b-instruct",
};

export function SimpleChat({ params: { id } }: SimpleChatProps) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      model: MODEL_MAPPING[id] || MODEL_MAPPING["1"],
    },
    initialMessages: [],
  });
  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      experimental_attachments: [
        {
          name: "image",
          contentType: "image/",
          url: "https://fastly.picsum.photos/id/572/1500/1500.jpg?hmac=u5E0tj_JBgx1nbPaw4nSaL0HIPJHYRXTT6biavzZpjI",
        },
      ],
    });
  };

  console.log(messages);

  return (
    <div>
      {status === "streaming" && <div className="fixed">Streaming...</div>}
      <div className="flex flex-col container py-8 mx-auto stretch">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : "AI: "}
            {m.experimental_attachments?.map(
              (attachment, index) =>
                attachment.contentType?.startsWith("image/") && (
                  <div key={index} className="mb-2">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name || "Attached image"}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )
            )}
            {m.content}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
