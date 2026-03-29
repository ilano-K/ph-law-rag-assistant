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
export const searchLegalDatabaseTool = (originalQuery: string) =>
  tool<z.infer<typeof paramsSchema>, { text: string; results: DocMetadata[] }>({
    description:
      "Search the Philippine republic act archives for relevant context. " +
      "Use this multiple times with different search strategies if the initial results do not contain the answer.",

    inputSchema: paramsSchema,

    execute: async ({ query }) => {
      const start = new Date().toISOString();
      console.log(
        `[AGENT] Searching vector database for: "${query}" at ${start}`,
      );

      const body: RAGRequest = {
        query_text: query,
        original_query: originalQuery,
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

        const end = new Date().toISOString();
        console.log(`[AGENT] retrieval succeeded for "${query}" at ${end}`);
        const results: DocMetadata[] = searchResults.results.map(
          (result: RAGResult) => result.metadata,
        );

        // Build a concise human-readable summary so the LLM receives text it
        // can reason over in the conversation stream.
        const summaryItems = results
          .slice(0, 5)
          .map((r, idx) => `${idx + 1}. ${r.title ?? r.title ?? "(no title)"}`);
        const summary = `Found ${results.length} documents. Top results:\n${summaryItems.join("\n")}`;

        return { text: summary, results };
      } catch (error) {
        clearTimeout(timeoutId);
        console.error(
          "RAG RETRIEVAL FAILED:",
          error,
          `at ${new Date().toISOString()}`,
        );
        // Always return the expected tool shape so the Tool type matches.
        const errText =
          error instanceof Error ? `${error.message}` : "Retrieval failed";
        return { text: `RAG retrieval failed: ${errText}`, results: [] };
      }
    },
  });
