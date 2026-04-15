import { generateText, UIMessageStreamWriter } from "ai";
import { models } from "../ai/models";

export async function generateConversationTitle(
  writer: UIMessageStreamWriter,
  firstMessageText: string,
): Promise<string> {
  try {
    // 2. Await the generation directly
    const { text } = await generateText({
      model: models.geminiFast, // Perfect use case for a fast, cheap model!
      system: "Summarize this into a 3-word title. No quotes.",
      prompt: firstMessageText,
    });

    const cleanTitle = text.trim();

    // 3. Send it to the frontend UI stream
    writer.write({ type: "data-title", data: { title: cleanTitle } });

    // 4. Return it back to your streamService so Supabase can save it!
    return cleanTitle;
  } catch (error) {
    console.error("Failed to generate title:", error);

    // Always return a fallback string just in case the AI API goes down,
    // otherwise your database will crash trying to save 'undefined'!
    return "New Legal Research";
  }
}
