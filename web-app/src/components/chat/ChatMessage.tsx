import { UIMessage } from "ai";
import { Scale } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessageProps {
  msg: UIMessage;
}
export function ChatMessage({ msg }: ChatMessageProps) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3 mt-1 shrink-0">
          <Scale size={16} />
        </div>
      )}

      <div
        className={`px-6 max-w-[80%] ${
          isUser
            ? "bg-surface border border-border rounded-3xl rounded-tr-sm text-foreground py-4"
            : "bg-transparent text-foreground leading-relaxed pb-4"
        }`}
      >
        {msg.parts?.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={`${msg.id}-${i}`}
                className="max-w-none text-foreground"
              >
                <MarkdownRenderer>{part.text}</MarkdownRenderer>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
