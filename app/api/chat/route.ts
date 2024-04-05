import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";

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
        });
        break;
      case "Anthropic":
        model = new ChatAnthropic({
          temperature: 0.1,
          modelName,
        });
        break;
      default:
        throw new Error("Invalid model type");
    }

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);
    return new Response(error.message || "Something went wrong!", { status: error.status || 500 });
  }
}
