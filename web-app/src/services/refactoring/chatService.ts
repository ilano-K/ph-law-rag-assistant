import { UIMessage } from "ai";
import { SupabaseClient } from "@supabase/supabase-js";

// types
type chat = {
  id: string;
  title: string;
  messages: UIMessage[];
  created_at: string;
};

type userChats = {
  data: chat[];
};

// save/retrieve
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

export async function fetchChats({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient;
}): Promise<userChats> {
  const { data, error } = await supabase
    .from("chats")
    .select("id, title, messages, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Supabase error retrieving user chats");
    return { data: [] };
  }
  return { data: data ?? [] };
}
