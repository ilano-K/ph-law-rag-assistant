import { SupabaseClient } from "@supabase/supabase-js";
import { Document } from "../types/documents";

export type DocumentData = {
  data: Document[];
  totalPages: number;
  totalItems: number;
};

export async function fetchCases(
  supabase: SupabaseClient,
  page: number = 1,
  pageSize: number = 10,
): Promise<DocumentData> {
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

export async function fetchActs(
  supabase: SupabaseClient,
  page: number = 1,
  pageSize: number = 10,
): Promise<DocumentData> {
  return { data: [], totalPages: 0, totalItems: 0 };
}

export async function fetchRepublicActs(
  supabase: SupabaseClient,
  page: number = 1,
  pageSize: number = 10,
): Promise<DocumentData> {
  return { data: [], totalPages: 0, totalItems: 0 };
}
