import { generateText, Output } from "ai";
import { RAG_REWRITE_QUERY_PROMPT } from "./prompts";
import { RAGRewriteSchema } from "@/src/types/retrieval";
import { models } from "../ai/models";

export async function rewriteQuery(query: string) {
  const { output: result } = await generateText({
    model: models.trinity,
    prompt: query,
    system: RAG_REWRITE_QUERY_PROMPT,
    output: Output.object({
      schema: RAGRewriteSchema,
    }),
  });

  return result.userQuery;
}
