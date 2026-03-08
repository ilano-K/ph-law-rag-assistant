import { z } from "zod";

export const intentSchema = z.object({
  userIntent: z.enum(["search", "chat", "none"]),
});
