import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  ModelMessage,
  generateText,
  stepCountIs,
} from "ai";
import { LEGAL_SYSTEM_PROMPT } from "@/src/helpers/ai/prompts";
import {
  classifyUserIntent,
  writeFallBackMessage,
} from "@/src/services/routeUserQueryService";
import { models } from "@/src/ai/models";
import { generateConversationTitle } from "@/src/services/generateTitleService";
import { searchLegalDatabaseTool } from "@/src/helpers/ai/tools";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: string } = await req.json();
  console.log(
    `[API] /api/chat POST received - messages=${messages?.length ?? 0} at ${new Date().toISOString()}`,
  );
  console.log(conversationId);
  return;
  const conversation: ModelMessage[] = await convertToModelMessages(messages);

  const { userIntent } = await classifyUserIntent(conversation);
  console.log(`this is the user intent: ${userIntent}`);

  const stream = createUIMessageStream({
    async execute({ writer }) {
      const execStart = new Date().toISOString();
      if (messages.length === 1) {
        const titleContext = messages[0].parts[0] as {
          type: string;
          text: string;
        }; //first user query

        generateConversationTitle(writer, titleContext.text);
      }
      console.log(
        `[STREAM] execute start userIntent=${userIntent} at ${execStart}`,
      );
      let databaseContext = "";
      if (userIntent === "none") {
        console.log("[STREAM] userIntent=none -> writing fallback message");
        writeFallBackMessage(writer);
        return;
      } else if (userIntent === "search") {
        const recentUserQuery = messages[messages.length - 1].parts[0] as {
          type: string;
          text: string;
        };
        const { toolResults } = await generateText({
          model: models.nvidia,
          system: LEGAL_SYSTEM_PROMPT,
          messages: conversation,
          tools: {
            searchLegalDatabase: searchLegalDatabaseTool(recentUserQuery.text),
          },
          stopWhen: stepCountIs(3),
        });

        if (toolResults && toolResults.length > 0) {
          console.log(`[LAYER 1] Success! Retrieved data from database.`);
          // retrieve the last for now
          const lastOutput = toolResults[toolResults.length - 1].output;
          databaseContext = `\n\n--- RELEVANT LEGAL CONTEXT FROM DATABASE ---\n${JSON.stringify(
            lastOutput,
          )}`;
        }
      }

      console.log(`[LAYER 2] Passing context to another LLM call`);
      const result = streamText({
        model: models.trinity,
        system: LEGAL_SYSTEM_PROMPT + databaseContext,
        messages: conversation,
      });

      console.log("[STRElAM] merging UI message stream (awaiting completion)");
      await writer.merge(result.toUIMessageStream());
      console.log("[STREAM] merge completed");
      console.log(`[STREAM] execute finished at ${new Date().toISOString()}`);
    },
  });

  console.log(`[API] returning stream response at ${new Date().toISOString()}`);
  return createUIMessageStreamResponse({ stream: stream });
}
