import { SupabaseClient } from "@supabase/supabase-js";
import { complexAIContent, Conversations } from "../types/messages";

export async function saveConversation(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  title: string,
) {
  const { error } = await supabase.from("conversations").upsert({
    user_id: userId,
    id: id,
    title: title,
  });

  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}

export async function saveMessage(
  supabase: SupabaseClient,
  userid: string,
  conversationId: string,
  role: string,
  content: complexAIContent,
) {
  const { error } = await supabase.from("messages").insert({
    id: crypto.randomUUID(),
    user_id: userid,
    conversation_id: conversationId,
    role: role,
    content: content,
  });
  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}

export async function fetchUserConversations(
  supabase: SupabaseClient,
  userId: string,
): Promise<Conversations> {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error retrieving conversations:", error.message);
    return { data: [] };
  }

  return {
    data: data ?? [],
  };
}

export async function fetchChatHistory(
  supabase: SupabaseClient,
  conversationId: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase error retrieving chat history:", error.message);
    return { data: [] };
  }
  return {
    data: data ?? [],
  };
}
