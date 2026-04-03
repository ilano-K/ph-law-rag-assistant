import { supabase } from "../helpers/supabase.";

export async function fetchCases(page: number = 1, pageSize: number = 10) {
  // 1. calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 2. add count to calculate the total number of pages
  const { data, error, count } = await supabase
    .from("documents")
    .select("*, case_digests(*)", { count: "exact" })
    .eq("type", "case")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Pagination error: ", error.message);
    return { data: [], totalPages: 0, totalItems: 0 };
  }
  // 3. Calculate total number of pages
  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
    data: data ?? [],
    totalPages: totalPages,
    totalItems: count ?? 0,
  };
}

export async function fetchActs(page: number = 1, pageSize: number = 10) {
  return { data: [], totalPages: 0, totalItems: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("documents")
    .select("*, act_digests(*)", { count: "exact" })
    .eq("type", "case")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Pagination error: ");
    return [];
  }
  return data ?? [];
}

export async function fetchRepublicActs() {
  return { data: [], totalPages: 0, totalItems: 0 };
  const { data, error } = await supabase
    .from("documents")
    .select("*, republic_act_digests(*)")
    .eq("type", "case");
  if (error) {
    return [];
  }
  return data ?? [];
}
