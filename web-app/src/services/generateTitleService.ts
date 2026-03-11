import { generateText, UIMessageStreamWriter } from "ai";
import { models } from "../ai/models";

export async function generateConversationTitle(
  writer: UIMessageStreamWriter,
  firstMessageText: string,
) {
  generateText({
    model: models.geminiFast,
    system: "Summarize this into a 3-word title. No quotes.",
    prompt: firstMessageText,
  })
    .then(({ text }) => {
      writer.write({ type: "data-title", data: { title: text.trim() } });
    })
    .catch(console.error);
}
