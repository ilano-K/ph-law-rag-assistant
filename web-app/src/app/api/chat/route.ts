// prettier-ignore
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream, ModelMessage, stepCountIs} from "ai";
// prettier-ignore
import { LEGAL_SYSTEM_PROMPT} from "@/src/helpers/ai/prompts";
// prettier-ignore
import { classifyUserIntent, writeFallBackMessage } from "@/src/services/routeUserQueryService";
import { prepareRagPrompt } from "@/src/services/ragService";
import { models } from "@/src/ai/models";
import { generateConversationTitle } from "@/src/services/generateTitleService";
import { searchLegalDatabaseTool } from "@/src/helpers/ai/tools";

export async function POST(req: Request) {
  // 1. Messages
  const { messages }: { messages: UIMessage[] } = await req.json();
  const firstMessage = messages[0].parts[0] as { type: string; text: string };
  // const recentMessage = messages[messages.length - 1].parts[0] as {
  //   type: string;
  //   text: string;
  // };
  const conversation: ModelMessage[] = await convertToModelMessages(messages);

  // 2. Extract user intent
  const { userIntent } = await classifyUserIntent(conversation);
  console.log(`this is the user intent: ${userIntent}`);
  // 3. Execute stream of llm calls
  const stream = createUIMessageStream({
    async execute({ writer }) {
      // if (messages.length === 1)
      //   generateConversationTitle(writer, firstMessage?.text);
      // comment for now for less token consumption
      // intent
      if (userIntent === "none") {
        writeFallBackMessage(writer);
        return;
      }
      // conversation with response
      const result = streamText({
        model: models.gemini,
        messages: conversation,
        system: LEGAL_SYSTEM_PROMPT,
        tools:
          userIntent === "search"
            ? { searchLegalDatabase: searchLegalDatabaseTool }
            : {},
        stopWhen: stepCountIs(100),
        onStepFinish({ text, toolCalls, finishReason }) {
          console.log(`\n--- STEP FINISHED ---`);
          console.log(
            `📝 Text generated:`,
            text ? text : "[No text, only tool call]",
          );
          console.log(
            `🛠️ Tools used:`,
            toolCalls.map((t) => t.toolName),
          );
          console.log(`🛑 Step Finish Reason:`, finishReason);
        },
        onFinish({ finishReason }) {
          console.log(
            `\n🏁 FULL STREAM FINISHED. Final Reason: ${finishReason}`,
          );
        },
        onError({ error }) {
          console.error("\n🚨 FATAL STREAM ERROR:", error);
        },
      });

      console.log(result);
      writer.merge(result.toUIMessageStream());
    },
  });
  return createUIMessageStreamResponse({ stream: stream });
}
