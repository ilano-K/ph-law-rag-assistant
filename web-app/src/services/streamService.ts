import {
  createUIMessageStream,
  generateText,
  ModelMessage,
  stepCountIs,
  streamText,
  UIDataTypes,
  UIMessage,
  UITools,
} from "ai";
import { generateConversationTitle } from "./generateTitleService";
import { writeFallBackMessage } from "./routeUserQueryService";
import { models } from "../ai/models";
import { LEGAL_SYSTEM_PROMPT } from "../lib/ai/prompts";
import { searchLegalDatabaseTool } from "../lib/ai/tools";
import { complexAIContent } from "../types/messages";

type stream = {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  userIntent: "search" | "none" | "chat";
  conversation: ModelMessage[];
  onNewChat?: (title: string) => Promise<void>;
  onAiResponse?: (content: complexAIContent) => Promise<void>;
};

export async function processChatStream({
  messages,
  userIntent,
  conversation,
  onNewChat,
  onAiResponse,
}: stream) {
  const stream = createUIMessageStream({
    async execute({ writer }) {
      const execStart = new Date().toISOString();
      if (messages.length === 1) {
        const titleContext = messages[0].parts[0] as {
          type: string;
          text: string;
        }; //first user query

        const title = await generateConversationTitle(
          writer,
          titleContext.text,
        );
        if (onNewChat) {
          await onNewChat(title);
        }
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
        onFinish: async ({ response }) => {
          if (onAiResponse) {
            await onAiResponse(response.messages[0].content);
          }
        },
      });

      console.log("[STRElAM] merging UI message stream (awaiting completion)");
      await writer.merge(result.toUIMessageStream());
      console.log("[STREAM] merge completed");
      console.log(`[STREAM] execute finished at ${new Date().toISOString()}`);
    },
  });
  return stream;
}
