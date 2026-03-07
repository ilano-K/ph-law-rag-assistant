import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  generateText,
} from "ai";

import { google } from "@ai-sdk/google";
import {
  RetrieveDocsRequest,
  RetrieveDocsResponse,
  RetrieveDocsResult,
} from "@/src/types/retrieval";
import { buildRagPrompt, LEGAL_SYSTEM_PROMPT } from "@/src/lib/prompts";

export async function POST(req: Request) {
  // 1. Messages
  const { messages }: { messages: UIMessage[] } = await req.json();

  const firstMessage = messages[0].parts[0] as { type: string; text: string };

  const recentMessage = messages[messages.length - 1].parts[0] as {
    type: string;
    text: string;
  };

  // 2.
  const body: RetrieveDocsRequest = {
    query_text: recentMessage?.text,
    top_k: 5,
    alpha: 0.5,
  };

  const searchResponse = await fetch("http://localhost:8000/api/v1/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const searchResults: RetrieveDocsResponse = await searchResponse.json();
  const contextMetadata = searchResults.results.map(
    (result: RetrieveDocsResult) => result.metadata,
  );

  const ragPrompt: string = buildRagPrompt(
    recentMessage?.text,
    contextMetadata,
  );

  const stream = createUIMessageStream({
    async execute({ writer }) {
      // if (messages.length === 1)
      //   generateText({
      //     model: google("gemini-2.5-flash-lite"),
      //     system: "Summarize this into a 3-word title. No quotes.",
      //     prompt: firstMessage?.text ?? "",
      //   })
      //     .then(({ text }) => {
      //       writer.write({ type: "data-title", data: { title: text.trim() } });
      //     })
      //     .catch(console.error);
      const conversation = await convertToModelMessages(messages);
      conversation[conversation.length - 1].content = ragPrompt;
      const result = streamText({
        model: google("gemini-2.5-flash"),
        messages: conversation,
        system: LEGAL_SYSTEM_PROMPT,
      });

      writer.merge(result.toUIMessageStream());
    },
  });
  return createUIMessageStreamResponse({ stream: stream });
}
