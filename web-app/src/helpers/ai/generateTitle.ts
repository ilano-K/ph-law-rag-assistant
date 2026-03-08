import { generateText, UIMessageStreamWriter } from "ai";
import { google } from "@ai-sdk/google";

export async function generateConversationTitle(
  writer: UIMessageStreamWriter,
  firstMessageText: string,
) {
  generateText({
    model: google("gemini-2.5-flash-lite"),
    system: "Summarize this into a 3-word title. No quotes.",
    prompt: firstMessageText,
  })
    .then(({ text }) => {
      writer.write({ type: "data-title", data: { title: text.trim() } });
    })
    .catch(console.error);
}
