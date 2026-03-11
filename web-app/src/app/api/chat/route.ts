// prettier-ignore
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream, ModelMessage} from "ai";
// prettier-ignore
import { LEGAL_SYSTEM_PROMPT} from "@/src/services/prompts";
// prettier-ignore
import { extractUserIntent, writeFallBackMessage } from "@/src/services/intent";
import { prepareRagPrompt } from "@/src/services/rag";
import { models } from "@/src/ai/models";

export async function POST(req: Request) {
  // 1. Messages
  const { messages }: { messages: UIMessage[] } = await req.json();
  const firstMessage = messages[0].parts[0] as { type: string; text: string };
  const recentMessage = messages[messages.length - 1].parts[0] as {
    type: string;
    text: string;
  };
  const conversation: ModelMessage[] = await convertToModelMessages(messages);

  // 2. Extract user intent
  const intent = await extractUserIntent(conversation);
  console.log(intent.userIntent);
  // 3. Execute stream of llm calls
  const stream = createUIMessageStream({
    async execute({ writer }) {
      // if (messages.length === 1)
      //   generateConversationTitle(writer, firstMessage?.text);
      // comment for now for less token consumption
      // intent
      if (intent.userIntent === "search") {
        await prepareRagPrompt(recentMessage?.text, conversation);
      } else if (intent.userIntent === "none") {
        writeFallBackMessage(writer);
        return;
      }

      // conversation
      console.log("THIS IS THE CONVERSATION:");
      console.log(conversation);
      const result = streamText({
        model: models.trinity,
        messages: conversation,
        system: LEGAL_SYSTEM_PROMPT,
      });

      writer.merge(result.toUIMessageStream());
    },
  });
  return createUIMessageStreamResponse({ stream: stream });
}
