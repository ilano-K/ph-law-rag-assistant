import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  ModelMessage,
} from "ai";
import { classifyUserIntent } from "@/src/services/routeUserQueryService";
import { processChatStream } from "@/src/services/streamService";
import { createClient } from "@/src/helpers/supabase/server";
import {
  saveConversation,
  saveMessage,
} from "@/src/services/conversationService";
import { uuidv4 } from "zod";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: string } = await req.json();
  console.log(
    `[API] /api/chat POST received - messages=${messages?.length ?? 0} at ${new Date().toISOString()}`,
  );

  // CHECK AUTH
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversation: ModelMessage[] = await convertToModelMessages(messages);

  // always the user
  const recentMessageContent = conversation[conversation.length - 1].content;
  if (messages.length === 1) {
    await saveConversation(supabase, user.id, conversationId, "New Chat...");
  }
  await saveMessage(
    supabase,
    user.id,
    conversationId,
    "user",
    recentMessageContent,
  );

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
    onNewChat: async (title) => {
      await saveConversation(supabase, user.id, conversationId, title);
    },
    onAiResponse: async (content) => {
      await saveMessage(
        supabase,
        user.id,
        conversationId,
        "assistant",
        content,
      );
    },
  });

  console.log(`[API] returning stream response at ${new Date().toISOString()}`);
  return createUIMessageStreamResponse({ stream: stream });
}
