import { models } from "@/src/ai/models";
import { generateText, UIMessage } from "ai";

export async function generateChatTitle({
  messages,
}: {
  messages: UIMessage[];
}): Promise<string> {
  const firstMessage = messages[0].parts[0] as {
    type: string;
    text: string;
  };

  try {
    const result = await generateText({
      model: models.geminiFast,
      system: "Summarize this into a 3-word title. No quotes.",
      prompt: firstMessage.text,
    });
    return result.text;
  } catch (error) {
    console.error(`Error generating a title ${error}`);
    return "New Conversation";
  }
}
