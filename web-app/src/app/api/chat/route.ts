// prettier-ignore
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream, ModelMessage} from "ai";
// prettier-ignore
import { LEGAL_SYSTEM_PROMPT} from "@/src/helpers/prompts";
// prettier-ignore
import { routeUserQuery, writeFallBackMessage } from "@/src/services/routeUserQueryService";
import { prepareRagPrompt } from "@/src/services/ragService";
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
  const { userIntent, rewritten_query } = await routeUserQuery(conversation);
  console.log(userIntent);
  console.log(rewritten_query ?? "");
  // 3. Execute stream of llm calls
  const stream = createUIMessageStream({
    async execute({ writer }) {
      // if (messages.length === 1)
      //   generateConversationTitle(writer, firstMessage?.text);
      // comment for now for less token consumption
      // intent
      if (userIntent === "search") {
        // if the stupid llm hallucinated, use the initial user query as fallback.
        const searchQuery = rewritten_query
          ? rewritten_query
          : recentMessage?.text;
        await prepareRagPrompt(recentMessage?.text, searchQuery, conversation);
      } else if (userIntent === "none") {
        writeFallBackMessage(writer);
        return;
      }

      // conversation
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
