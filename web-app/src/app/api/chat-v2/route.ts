import { convertToModelMessages, streamText, UIMessage } from "ai";
import { models } from "@/src/ai/models";
import { saveChat } from "@/src/services/refactoring/chatService";
import { requireAuth } from "@/src/utils/requireAuth";

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();

  const auth = await requireAuth();
  if (!auth) return new Response("Unauthorized", { status: 401 });
  const userId = auth.user.id;
  const supabase = auth.supabase;

  const result = streamText({
    model: models.gemini,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages, userId, supabase });
    },
  });
}
