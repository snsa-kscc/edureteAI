import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse, LangChainStream } from "ai";
import { Redis } from "@upstash/redis";
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { createClient } from "@vercel/kv";

// export const runtime = "edge";

//const client = Redis.fromEnv();
const client = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const defaultSystemPrompt = `You are a reasoning AI tasked with solving 
the user's math-based questions. Logically arrive at the solution, and be 
factual. In your answers, clearly detail the steps involved and give the 
final answer. If you can't solve the question, say "I don't know".`;

// const formatMessage = (message: VercelChatMessage) => {
//   return `${message.role}: ${message.content}`;
// };

export async function POST(req: NextRequest) {
  try {
    const { messages, model, chatId, userSystemPrompt, chatAreaId } = await req.json();

    // if (loadMessages) {
    //   const populateHistoricChat = await client.lrange(chatId, 0, -1);
    //   return new Response(JSON.stringify(populateHistoricChat));
    // }

    //const messages = messages ?? [];
    // const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const systemPrompt = userSystemPrompt || defaultSystemPrompt;
    const TEMPLATE = `${systemPrompt}

    Current conversation:
    {chat_history}

    User: {input}
    AI:`;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const [family, ...rest]: string[] = model.split("/");
    const modelName = rest.join("/");

    let llm;

    switch (family) {
      case "OpenAI":
        llm = new ChatOpenAI({
          temperature: 0.1,
          modelName,
          streaming: true,
        });
        break;
      case "Anthropic":
        llm = new ChatAnthropic({
          temperature: 0.1,
          modelName,
          streaming: true,
        });
        break;
      default:
        throw new Error("Invalid model type");
    }

    // const outputParser = new BytesOutputParser();

    // const old_chain = prompt.pipe(llm).pipe(outputParser);

    // const old_stream = await old_chain.stream({
    //   chat_history: formattedPreviousMessages.join("\n"),
    //   input: currentMessageContent,
    // });

    const memory = new BufferMemory({
      memoryKey: "chat_history",
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: `${chatId}//${chatAreaId}//${model}`,
        // @ts-ignore
        client,
      }),
    });

    const chain = new ConversationChain({ llm, memory, prompt });
    const { stream, handlers } = LangChainStream();

    chain.invoke({ input: currentMessageContent, callbacks: [handlers] });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);
    return new Response(error.message || "Something went wrong!", { status: error.status || 500 });
  }
}
