import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  ModelMessage,
} from "ai";
import { classifyUserIntent } from "@/src/services/routeUserQueryService";
import { processChatStream } from "@/src/services/streamService";
import { createClient } from "@/src/lib/supabase/server";
import {
  saveConversation,
  saveMessage,
} from "@/src/services/conversationService";

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

  const { userIntent } = await classifyUserIntent(conversation);
  console.log(`this is the user intent: ${userIntent}`);

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
