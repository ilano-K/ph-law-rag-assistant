import { z } from "zod";

export const intentSchema = z.object({
  needsSearch: z
    .boolean()
    .describe(
      "True if the user is asking a NEW legal question. False if False if they are just reformatting, summarizing, or following up on the current conversation.",
    ),
});
