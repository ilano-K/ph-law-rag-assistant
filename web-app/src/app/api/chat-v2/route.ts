import { convertToModelMessages, streamText, UIMessage } from "ai";
import { models } from "@/src/ai/models";
import { saveChat } from "@/src/services/refactoring/chatService";
import { requireAuth } from "@/src/utils/requireAuth";
import { createIdGenerator } from "ai";

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();

  // auth (user_id + supabase client)
  const auth = await requireAuth();
  if (!auth) return new Response("Unauthorized", { status: 401 });
  const userId = auth.user.id;
  const supabase = auth.supabase;

  // ai stream
  const result = streamText({
    model: models.gemini,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }), //needs id for server side persistence
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages, userId, supabase }); // chat store
    },
  });
}
