"use client";

import { useRef, useState } from "react";
import { ArrowUp, Scale } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatView() {
  // state to store conversation history
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content: "What is the penalty for cyber libel under RA 10175?",
    },
    {
      role: "ai",
      content:
        "Under Republic Act No. 10175 (Cybercrime Prevention Act of 2012), the penalty for cyber libel is one degree higher than that provided for traditional libel under the Revised Penal Code. This generally means prision mayor in its minimum and medium periods.",
    },
  ]);
  // state to store what the user is currently typing
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = { role: "user", content: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // reset height
      el.style.height = el.scrollHeight + "px"; // grow to fit content
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {messages.length === 0 ? (
        /* --- EMPTY STATE (New Thread) --- */
        <div className="flex flex-col items-center justify-center h-full">
          {/* label with gradient text */}
          <div className="mb-10 text-3xl font-legal text-center text-gradient-accent font-bold">
            What law would you like to explore today?
          </div>

          {/* type bar with gradient + blur */}
          <div className="flex items-center w-[800px] max-w-full rounded-full py-2 px-4 bg-gradient-accent-blur mb-40">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70 resize-none overflow-hidden"
              placeholder="Type a law, e.g., RA 7610..."
            />
            <button
              onClick={handleSendMessage}
              className="flex justify-center items-center bg-white rounded-full w-10 h-10 ml-2 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <ArrowUp size={24} className="text-background" />
            </button>
          </div>
        </div>
      ) : (
        /* --- ACTIVE CHAT STATE --- */
        <div className="flex flex-col h-full">
          <div className="flex w-full h-15 justify-center items-center p-2">
            <span className="font-bold">Title</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 w-full max-w-4xl mx-auto">
            {/*  We map over the objects and use the role to change the layout */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3 mt-1 shrink-0">
                    <Scale size={16} />{" "}
                    {/* A nice legal scale icon for the AI */}
                  </div>
                )}

                <div
                  className={`px-6 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-surface border border-border rounded-3xl rounded-tr-sm text-foreground py-4"
                      : "bg-transparent text-foreground leading-relaxed pb-4"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 flex justify-center">
            <div className="flex items-center w-[800px] max-w-full rounded-full py-2 px-4 bg-gradient-accent-blur">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70 resize-none overflow-hidden"
                placeholder="Ask a follow-up question..."
              />
              <button
                onClick={handleSendMessage}
                className="flex justify-center items-center bg-white rounded-full w-10 h-10 ml-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <ArrowUp size={24} className="text-background" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
