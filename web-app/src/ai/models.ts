import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
});

export const models = {
  geminiFast: google("gemini-2.5-flash-lite"),
  gemini: google("gemini-2.5-flash"),
  deepseek: openrouter.chat("deepseek/deepseek-chat"),
  trinity: openrouter.chat("arcee-ai/trinity-large-preview:free"),
  step: openrouter.completion("stepfun/step-3.5-flash:free"),
  nvidia: openrouter.chat("nvidia/nemotron-3-super-120b-a12b:free"),
};
