import { SupabaseClient } from "@supabase/supabase-js";
import { complexAIContent } from "../types/messages";

export async function saveConversation(
  supabase: SupabaseClient,
  id: string,
  title: string,
) {
  const { error } = await supabase.from("conversations").upsert({
    id: id,
    title: title,
  });

  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}

export async function saveMessage(
  supabase: SupabaseClient,
  conversationId: string,
  role: string,
  content: complexAIContent,
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
