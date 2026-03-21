import { supabase } from "../helpers/supabase.";

export async function fetchDocumentsFromSupabase() {
  // THE MAGIC QUERY: Get documents, and also grab their matching child digest rows!
  const { data, error } = await supabase
    .from("documents")
    .select("*, case_digests(*)")
    .eq("type", "case"); // Only fetch things marked as 'case'

  if (error) {
    return [];
  }
  return data ?? [];
}
