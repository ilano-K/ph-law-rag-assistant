import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  generateText,
  Output,
} from "ai";

import { google } from "@ai-sdk/google";
import {
  RetrieveDocsRequest,
  RetrieveDocsResponse,
  RetrieveDocsResult,
} from "@/src/types/retrieval";
import {
  buildRagPrompt,
  INTENT_SYSTEM_PROMPT,
  LEGAL_SYSTEM_PROMPT,
} from "@/src/lib/prompts";
import { intentSchema } from "@/src/types/ai";

export async function POST(req: Request) {
  // 1. Messages
  const { messages }: { messages: UIMessage[] } = await req.json();

  const firstMessage = messages[0].parts[0] as { type: string; text: string };

  const recentMessage = messages[messages.length - 1].parts[0] as {
    type: string;
    text: string;
  };

  const conversation = await convertToModelMessages(messages);

  // 2. Parse user intent
  const { output: intent } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    messages: conversation,
    system: INTENT_SYSTEM_PROMPT,
    output: Output.object({
      schema: intentSchema,
    }),
  });

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

      // intent
      if (intent.userIntent === "search") {
        console.log("INTENT IS NEEDS SEARCH");
        const body: RetrieveDocsRequest = {
          query_text: recentMessage?.text,
          top_k: 5,
          alpha: 0.5,
        };

        const searchResponse = await fetch(
          "http://localhost:8000/api/v1/retrieve",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        const searchResults: RetrieveDocsResponse = await searchResponse.json();
        const contextMetadata = searchResults.results.map(
          (result: RetrieveDocsResult) => result.metadata,
        );

        const ragPrompt: string = buildRagPrompt(
          recentMessage?.text,
          contextMetadata,
        );

        const conversation = await convertToModelMessages(messages);
        conversation[conversation.length - 1].content = ragPrompt;
      } else if (intent.userIntent === "none") {
        console.log("INTENT IS NONE - Short-circuiting LLM to save credits");

        // Create a unique ID for this specific manual message
        const fallbackId = `fallback-${Date.now()}`;

        // 1. Tell the UI a new AI text block is starting
        writer.write({ type: "text-start", id: fallbackId });

        // 2. Instantly push your exact fallback string to the chat window
        writer.write({
          type: "text-delta",
          id: fallbackId,
          delta:
            "I cannot answer this specific situation based on the provided Philippine laws.",
        });

        // 3. Tell the UI the message is finished streaming
        writer.write({ type: "text-end", id: fallbackId });

        // 4. CRITICAL: Exit the function early so it DOES NOT trigger the Gemini streamText below!
        return;
      }

      // conversation
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
