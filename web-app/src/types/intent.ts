import { z } from "zod";

export const QueryIntentSchema = z.object({
  userIntent: z.enum(["search", "chat", "none"]),
});
