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

export type content =
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
