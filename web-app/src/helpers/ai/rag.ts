// prettier-ignore
import { RetrieveDocsRequest, RetrieveDocsResponse,RetrieveDocsResult} from "@/src/types/retrieval";
import { ModelMessage } from "ai";
import { buildRagPrompt } from "./prompts";

export async function prepareRagPrompt(
  recentMessageText: string,
  conversation: ModelMessage[],
) {
  const body: RetrieveDocsRequest = {
    query_text: recentMessageText,
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

  const searchResults: RetrieveDocsResponse = await searchResponse.json();
  const contextMetadata = searchResults.results.map(
    (result: RetrieveDocsResult) => result.metadata,
  );

  const ragPrompt: string = buildRagPrompt(recentMessageText, contextMetadata);
  conversation[conversation.length - 1].content = ragPrompt;
  return conversation;
}
