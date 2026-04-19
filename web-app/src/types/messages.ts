import {
  ReasoningUIPart,
  FilePart,
  ImagePart,
  TextPart,
  ToolApprovalRequest,
  ToolCallPart,
  ToolContent,
  ToolResultPart,
} from "ai";

export type complexAIContent =
  | string
  | (TextPart | ImagePart | FilePart)[]
  | (
      | TextPart
      | FilePart
      | ReasoningUIPart
      | ToolCallPart
      | ToolResultPart
      | ToolApprovalRequest
    )[]
  | ToolContent;

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export type Conversations = {
  data: Conversation[];
};

export type message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: complexAIContent;
  created_at: string;
};
