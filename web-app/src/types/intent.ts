import { z } from "zod";

export const QueryRouterSchema = z.object({
  userIntent: z.enum(["search", "chat", "none"]),
  rewritten_query: z.string(),
});
