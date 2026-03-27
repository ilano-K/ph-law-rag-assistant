import { tool } from "ai";
import { z } from "zod";
// Import your beautifully defined types!
import {
  RAGRequest,
  RAGResponse,
  RAGResult,
  DocMetadata,
} from "@/src/types/retrieval";

const paramsSchema = z.object({
  query: z
    .string()
    .describe(
      "The specific legal concept, GR number, or RA number to search for.",
    ),
});
export const searchLegalDatabaseTool = tool<
  z.infer<typeof paramsSchema>,
  DocMetadata[]
>({
  description:
    "Search the Philippine republic act archives for relevant context. " +
    "Use this multiple times with different search strategies if the initial results do not contain the answer.",

  inputSchema: paramsSchema,

  execute: async ({ query }) => {
    console.log(`[AGENT] Searching vector database for: "${query}"`);

    const body: RAGRequest = {
      query_text: query,
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!searchResponse.ok) {
        throw new Error(
          `Retrieval API returned status ${searchResponse.status}`,
        );
      }

      const searchResults: RAGResponse = await searchResponse.json();

      return searchResults.results.map((result: RAGResult) => result.metadata);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("RAG RETRIEVAL FAILED:", error);
      return [];
    }
  },
});
