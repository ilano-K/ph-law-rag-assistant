import { convertToModelMessages, streamText } from "ai";
import { models } from "@/src/ai/models";
import { saveChat } from "@/src/services/refactoring/chatService";
import { requireAuth } from "@/src/utils/requireAuth";
import { createIdGenerator } from "ai";
import { generateChatTitle } from "@/src/services/refactoring/aiService";

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const auth = await requireAuth();
  if (!auth) return new Response("Unauthorized", { status: 401 });

  // check intent

  // 1. generate title for first chat in the background
  let titlePromise: Promise<string> | null = null;
  if (messages.length === 1) titlePromise = generateChatTitle({ messages });

  // 3. ai stream
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

    onFinish: async ({ messages }) => {
      const chatTitle = titlePromise ? await titlePromise : undefined;
      await saveChat({
        chatId,
        messages,
        userId: auth.user.id,
        supabase: auth.supabase,
        title: chatTitle,
      }); // chat store
    },
  });
}
