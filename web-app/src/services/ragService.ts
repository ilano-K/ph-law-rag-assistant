// prettier-ignore
import { RAGRequest, RAGResponse,RAGResult} from "@/src/types/retrieval";
import { ModelMessage } from "ai";
import { buildRagPrompt } from "../helpers/prompts";

export async function prepareRagPrompt(
  recentMessageText: string,
  userQuery: string,
  conversation: ModelMessage[],
) {
  // RAG API
  const body: RAGRequest = {
    query_text: userQuery,
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
