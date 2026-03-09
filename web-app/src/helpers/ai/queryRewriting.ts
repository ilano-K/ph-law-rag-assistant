import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { RAG_REWRITE_QUERY_PROMPT } from "./prompts";
import { RAGRewriteSchema } from "@/src/types/retrieval";

export async function rewriteQuery(query: string) {
  // QUERY REWRITING
  const { output: result } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    prompt: query,
    system: RAG_REWRITE_QUERY_PROMPT,
    output: Output.object({
      schema: RAGRewriteSchema,
    }),
  });

  console.log("=========================");
  console.log(result.userQuery);

  return result.userQuery;
}
