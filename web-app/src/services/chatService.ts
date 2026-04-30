import { UIMessage } from "ai";
import { SupabaseClient } from "@supabase/supabase-js";

export async function saveChat({
  chatId,
  messages,
  userId,
  supabase,
}: {
  chatId: string;
  messages: UIMessage[];
  userId: string;
  supabase: SupabaseClient;
}): Promise<void> {
  const { error } = await supabase.from("chats").upsert({
    user_id: userId,
    id: chatId,
    messages: messages,
    title: "",
  });

  if (error) {
    console.log("Supabase error saving chat");
  }
}
