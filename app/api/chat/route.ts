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

const client = Redis.fromEnv();

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a reasoning AI tasked with solving 
the user's math-based questions. Logically arrive at the solution, and be 
factual. In your answers, clearly detail the steps involved and give the 
final answer. If you can't solve the question, say "I don't know".

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const [family, ...rest]: string[] = body.model.split("/");
    const modelName = rest.join("/");

    let model;

    switch (family) {
      case "OpenAI":
        model = new ChatOpenAI({
          temperature: 0.1,
          modelName,
          streaming: true,
        });
        break;
      case "Anthropic":
        model = new ChatAnthropic({
          temperature: 0.1,
          modelName,
          streaming: true,
        });
        break;
      default:
        throw new Error("Invalid model type");
    }

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const old_stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    const memory = new BufferMemory({
      memoryKey: "chat_history",
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: body.userId,
        client,
      }),
    });

    const improvedChain = new ConversationChain({ llm: model, memory, prompt });
    const { stream, handlers } = LangChainStream();

    improvedChain.invoke({ input: currentMessageContent, callbacks: [handlers] });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);
    return new Response(error.message || "Something went wrong!", { status: error.status || 500 });
  }
}
