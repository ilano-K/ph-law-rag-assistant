// prettier-ignore
import { RAGRequest, RAGResponse,RAGResult, RAGRewriteSchema} from "@/src/types/retrieval";
import { generateText, ModelMessage, Output } from "ai";
import { buildRagPrompt, RAG_REWRITE_QUERY_PROMPT } from "./prompts";
import { google } from "@ai-sdk/google";

export async function prepareRagPrompt(
  recentMessageText: string,
  conversation: ModelMessage[],
) {
  // QUERY REWRITING
  const { output: query } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    prompt: recentMessageText,
    system: RAG_REWRITE_QUERY_PROMPT,
    output: Output.object({
      schema: RAGRewriteSchema,
    }),
  });

  console.log("=========================");
  console.log(query.userQuery);
  // RAG API
  const body: RAGRequest = {
    query_text: query.userQuery,
    top_k: 5,
    alpha: 0.5,
  };

  const searchResponse = await fetch("http://localhost:8000/api/v1/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const searchResults: RAGResponse = await searchResponse.json();
  const contextMetadata = searchResults.results.map(
    (result: RAGResult) => result.metadata,
  );

  const ragPrompt: string = buildRagPrompt(recentMessageText, contextMetadata);
  conversation[conversation.length - 1].content = ragPrompt;
  return conversation;
}
