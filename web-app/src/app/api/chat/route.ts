// prettier-ignore
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream,
  generateText, Output,
  ModelMessage} from "ai";
import { google } from "@ai-sdk/google";
// prettier-ignore
import { INTENT_SYSTEM_PROMPT, LEGAL_SYSTEM_PROMPT} from "@/src/lib/ai/prompts";
// prettier-ignore
import { intentSchema } from "@/src/types/intent"
import { writeFallBackMessage } from "@/src/lib/ai/intent";
import { prepareRagPrompt } from "@/src/lib/ai/rag";
import { generateConversationTitle } from "@/src/lib/ai/generateTitle";

export async function POST(req: Request) {
  // 1. Messages
  const { messages }: { messages: UIMessage[] } = await req.json();
  const firstMessage = messages[0].parts[0] as { type: string; text: string };
  const recentMessage = messages[messages.length - 1].parts[0] as {
    type: string;
    text: string;
  };
  const conversation: ModelMessage[] = await convertToModelMessages(messages);

  // 2. Parse user intent
  const { output: intent } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    messages: conversation,
    system: INTENT_SYSTEM_PROMPT,
    output: Output.object({
      schema: intentSchema,
    }),
  });

  // 3. Execute stream of llm calls
  const stream = createUIMessageStream({
    async execute({ writer }) {
      if (messages.length === 1)
        generateConversationTitle(writer, firstMessage?.text);

      // intent
      if (intent.userIntent === "search") {
        await prepareRagPrompt(recentMessage?.text, conversation);
      } else if (intent.userIntent === "none") {
        writeFallBackMessage(writer);
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
