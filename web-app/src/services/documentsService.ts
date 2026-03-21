import { supabase } from "../helpers/supabase.";

export async function fetchCases() {
  const { data, error } = await supabase
    .from("documents")
    .select("*, case_digests(*)")
    .eq("type", "case");

  if (error) {
    return [];
  }
  return data ?? [];
}

export async function fetchActs() {
  const { data, error } = await supabase
    .from("documents")
    .select("*, act_digests(*)")
    .eq("type", "case");

  if (error) {
    return [];
  }
  return data ?? [];
}

export async function fetchRepublicActs() {
  const { data, error } = await supabase
    .from("documents")
    .select("*, republic_act_digests(*)")
    .eq("type", "case");
  if (error) {
    return [];
  }
  return data ?? [];
}
