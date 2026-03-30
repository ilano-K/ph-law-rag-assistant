import { supabase } from "../helpers/supabase.";

export async function saveConversation(id: string, title: string) {
  const { error } = await supabase.from("conversations").upsert({
    id: id,
    title: title,
  });

  if (error) {
    console.error("Supabase error saving conversation: ", error.message);
  }
}
