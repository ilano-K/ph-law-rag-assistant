import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  ModelMessage,
} from "ai";
import { classifyUserIntent } from "@/src/services/routeUserQueryService";
import { processChatStream } from "@/src/services/streamService";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: string } = await req.json();
  console.log(
    `[API] /api/chat POST received - messages=${messages?.length ?? 0} at ${new Date().toISOString()}`,
  );

  const conversation: ModelMessage[] = await convertToModelMessages(messages);
  // console.log(conversation.at(0)!["role"]);
  // const role = conversation.at(0)!["role"];
  // const content = conversation.at(0)!["content"];

  const { userIntent } = await classifyUserIntent(conversation);
  console.log(`this is the user intent: ${userIntent}`);

  // saving to database
  // 1. conversation length == 1 -> save conversation
  // 2. save user message
  // 3. save ai response message

  const stream = await processChatStream({
    messages,
    userIntent,
    conversation,
  });

  console.log(`[API] returning stream response at ${new Date().toISOString()}`);
  return createUIMessageStreamResponse({ stream: stream });
}
