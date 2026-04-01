import { supabase } from "../helpers/supabase.";
import { content } from "../types/messages";

export async function saveConversation(id: string, title: string) {
  const { error } = await supabase.from("conversations").upsert({
    id: id,
    title: title,
  });

  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}

export async function saveMessage(
  conversationId: string,
  role: string,
  content: content,
) {
  const { error } = await supabase.from("messages").insert({
    id: crypto.randomUUID(),
    conversation_id: conversationId,
    role: role,
    content: content,
  });
  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}
