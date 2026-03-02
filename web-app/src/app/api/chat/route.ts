import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  generateText,
} from "ai";

import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const firstMessage = messages[0].parts[0] as
    | { type: string; text: string }
    | undefined;

  const stream = createUIMessageStream({
    async execute({ writer }) {
      if (messages.length === 1)
        generateText({
          model: google("gemini-2.5-flash-lite"),
          system: "Summarize this into a 3-word title. No quotes.",
          prompt: firstMessage?.text ?? "",
        })
          .then(({ text }) => {
            writer.write({ type: "data-title", data: { title: text.trim() } });
          })
          .catch(console.error);

      const result = streamText({
        model: google("gemini-2.5-flash"),
        messages: await convertToModelMessages(messages),
      });

      writer.merge(result.toUIMessageStream());
    },
  });
  return createUIMessageStreamResponse({ stream: stream });
}
