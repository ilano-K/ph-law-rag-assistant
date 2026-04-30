// prettier-ignore
import { RAGRequest, RAGResponse,RAGResult} from "@/src/types/retrieval";
import { ModelMessage, UIMessageStreamWriter } from "ai";
import { buildRagPrompt } from "../lib/ai/prompts";
import { writeFallBackMessage } from "./routeUserQueryService";

export async function prepareRagPrompt(
  recentMessageText: string,
  userQuery: string,
  conversation: ModelMessage[],
  writer: UIMessageStreamWriter,
) {
  // RAG API
  const body: RAGRequest = {
    query_text: userQuery,
    top_k: 5,
    alpha: 0.5,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const searchResponse = await fetch(
      "http://localhost:8000/api/v1/retrieve",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!searchResponse.ok) {
      throw new Error(`Retrieval API returned status ${searchResponse.status}`);
    }

    const searchResults: RAGResponse = await searchResponse.json();
    const contextMetadata = searchResults.results.map(
      (result: RAGResult) => result.metadata,
    );

    const ragPrompt: string = buildRagPrompt(
      recentMessageText,
      contextMetadata,
    );
    conversation[conversation.length - 1].content = ragPrompt;
    return conversation;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("RAG RETRIEVAL FAILED:", error);

    const message =
      "I'm having a little trouble connecting to the legal archives right now, so I can't pull up the specific laws for your question. Could you please try asking again in a minute or two?";
    writeFallBackMessage(writer, message);

    return null;
  }
}
