import z from "zod";

export type RAGRequest = {
  query_text: string;
  original_query: string;
  top_k: number;
  alpha: number;
  filters?: filter[];
};

export type RAGResponse = {
  results: RAGResult[];
};

export type RAGResult = {
  id: string;
  score: number;
  metadata: DocMetadata;
};

type filter = {
  filter: string;
};

export type DocMetadata = {
  text: string;
  chunk_index: number;
  law_id: string;
  document_type: string;
  date_approved: string;
  title: string;
  source_url: string;
};

export const RAGRewriteSchema = z.object({
  userQuery: z
    .string()
    .describe("The string containing user reconstructed query."),
});
