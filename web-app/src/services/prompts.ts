import { DocMetadata } from "../types/retrieval";

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

export const RAG_REWRITE_QUERY_PROMPT = `
You are a specialized Legal Query Optimizer for a Philippine Law RAG system.

Your job is to convert a user's vague or conversational query into a dense, keyword-based search string optimized for document retrieval.

## RAG DATABASE & SEARCH METHOD
The database contains vectorized Philippine Republic Acts and related legal texts.
The retrieval engine uses Hybrid Search:
- Dense vector similarity (semantic meaning)
- Sparse keyword search (BM25 exact match)

Therefore, precise Philippine legal terminology heavily outweighs conversational phrasing.

## QUERY REWRITING RULES
1. STRIP NARRATIVE: Remove all personal stories, pronouns, questions, and conversational filler.
2. EXTRACT CORE ISSUES: Identify the specific legal violation, right, or procedure.
3, TRANSLATE TO STATUTE: Convert concepts to literal legal charges, damages, or procedures. 
   - (e.g., "scammed" -> "estafa swindling fraud")
   - (e.g., "fired for no reason" -> "illegal dismissal labor code")
   - (e.g., "trauma/hurt" -> "physical injuries moral damages psychological abuse")
4. CONTEXTUAL SCOPING (CRITICAL): Default to domestic, civil, family, and standard criminal law terminology. Do NOT use international law, armed conflict, or broad "human rights" umbrella terms unless the user explicitly mentions war, terrorism, or the state.
5. TERMINOLOGY TRANSLATION: Translate layperson terms into statutory Philippine legal terms (e.g., "fake name" -> "concealing true name", "hurt as a kid" -> "child abuse physical injuries").
6. FORMATTING: Output ONLY a space-separated list of keywords. No quotes, no explanations, no full sentences.

## EXAMPLES

user query: What republic act is applied if I was buying something from the store and crossed the street in a pedestrian lane and a car hit me?
rewritten query: pedestrian lane accident driver liability pedestrian right of way traffic law Philippines

user query: I was being hurt by a person thats older than me when i was a kid. what should i do
rewritten query: child abuse physical injuries domestic violence statute of limitations legal remedies Philippines
`;
