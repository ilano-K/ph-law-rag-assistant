import { ArrowUp } from "lucide-react";
import { RefObject } from "react";

interface ChatInputProps {
  input: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  className?: string;
}

export function ChatInput({
  input,
  textareaRef,
  onChange,
  onKeyDown,
  onSubmit,
  placeholder,
  className = "",
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center w-[800px] max-w-full rounded-full py-2 px-4 bg-gradient-accent-blur ${className}`}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={1}
        className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70 resize-none overflow-hidden"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="flex justify-center items-center bg-white rounded-full w-10 h-10 ml-2 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <ArrowUp size={24} className="text-background" />
      </button>
    </form>
  );
}
