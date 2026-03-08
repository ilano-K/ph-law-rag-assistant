import { DocMetadata } from "../../types/retrieval";

export const buildRagPrompt = (userQuery: string, context: DocMetadata[]) => {
  const formattedContext = context.map((metadata: DocMetadata) =>
    parseMetadata(metadata),
  );
  return `
    USER QUESTION:
    ${userQuery}

    RETRIEVED DOCUMENTS:
    ${formattedContext}
    `;
};

const parseMetadata = (metadata: DocMetadata) => {
  console.log(metadata.title);
  return `
Title: ${metadata.title}
Source: ${metadata.source_url}
Law Text: ${metadata.text}
------------------------`;
};

export const LEGAL_SYSTEM_PROMPT = `CRITICAL RULES:
1. NO META-TALK: Never use phrases like "The retrieved documents state..." Speak directly as the legal authority.
2. PERMITTED CONTEXT: You must base your legal facts ONLY on the provided documents. You MAY explain how the provided laws apply to the user's specific situation.
3. THE FALLBACK: If the provided documents are completely unrelated, reply EXACTLY with: "I cannot answer this specific situation based on the provided Philippine laws."
4. STRICT MARKDOWN FORMATTING: You MUST use exactly "## References" for your citation section. Do not drop the hashtags. Do NOT use an "Answer" header. Just start talking.

OUTPUT STRUCTURE:
[Directly answer the question here. Start immediately without any introductory headers. Use bullet points where appropriate.]

## References
* **[Title of Law]** - [Part/Section] 
* [URL]`;

export const INTENT_SYSTEM_PROMPT = `
You are an assistant that classifies user queries into one of three intents regarding PHILIPPINE laws or legal topics:

1. "chat" - The user is asking to reformat, summarize, or continue the current conversation.  
2. "search" - The user is asking a NEW legal or law-related question that may require retrieving external information.  
3. "none" - The user is asking about topics unrelated to laws or legal topics.  

Return **only one intent** ("chat", "search", or "none") based on the user's message.
`;
