import { UIMessageStreamWriter } from "ai";

export function writeFallBackMessage(
  writer: UIMessageStreamWriter,
  text?: string,
) {
  const fallbackId = `fallback-${Date.now()}`;
  // 1. Tell the UI a new AI text block is starting
  writer.write({ type: "text-start", id: fallbackId });
  // 2. Instantly push your exact fallback string to the chat window

  const message: string =
    text ??
    "I cannot answer this specific situation based on the provided Philippine laws.";

  writer.write({
    type: "text-delta",
    id: fallbackId,
    delta: message,
  });
  // 3. Tell the UI the message is finished streaming
  writer.write({ type: "text-end", id: fallbackId });
}
