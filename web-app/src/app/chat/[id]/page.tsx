import ChatView from "@/src/components/chat/ChatView";
import { getChat } from "@/src/services/refactoring/chatService";
import { requireAuth } from "@/src/utils/requireAuth";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const chatId = resolvedParams.id;

  const auth = await requireAuth();
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const chat = await getChat({
    chatId: chatId,
    userId: auth.user.id,
    supabase: auth.supabase,
  });

  console.log(chat?.messages);
  return <ChatView providedChatId={chatId} initialMessages={chat?.messages} />;
}
