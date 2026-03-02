"use client"; // Required for Vercel AI SDK hooks

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Scale } from "lucide-react"; // Assuming you are using lucide-react

export default function ChatView() {
  const [chatTitle, setChatTitle] = useState("");
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    onData: (dataPart) => {
      if (dataPart.type === "data-title") {
        const data = dataPart.data as { title: string };
        setChatTitle(data.title);
      }
    },
  });

  const textareaRefEmpty = useRef<HTMLTextAreaElement>(null);
  const textareaRefActive = useRef<HTMLTextAreaElement>(null);

  // resizing logic
  const onTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => {
    setInput(e.target.value);

    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // submit logic
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // sendMessage
    sendMessage({ text: input });
    setInput("");

    // Reset heights
    if (textareaRefEmpty.current)
      textareaRefEmpty.current.style.height = "auto";
    if (textareaRefActive.current)
      textareaRefActive.current.style.height = "auto";
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {messages.length === 0 ? (
        /* --- EMPTY STATE (New Thread) --- */
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-10 text-3xl font-legal text-center text-gradient-accent font-bold">
            What law would you like to explore today?
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="flex items-center w-[800px] max-w-full rounded-full py-2 px-4 bg-gradient-accent-blur mb-40"
          >
            <textarea
              ref={textareaRefEmpty}
              value={input}
              onChange={(e) => onTextareaChange(e, textareaRefEmpty)}
              onKeyDown={onKeyDown}
              rows={1}
              className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70 resize-none overflow-hidden"
              placeholder="Type a law, e.g., RA 7610..."
            />
            <button
              type="submit"
              className="flex justify-center items-center bg-white rounded-full w-10 h-10 ml-2 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <ArrowUp size={24} className="text-background" />
            </button>
          </form>
        </div>
      ) : (
        /* --- ACTIVE CHAT STATE --- */
        <div className="flex flex-col h-full">
          <div className="flex w-full h-15 justify-center items-center p-2">
            <span className="font-bold">{chatTitle}</span>
          </div>

          <div className="flex-1 p-8 space-y-8 w-full max-w-4xl mx-auto overflow-y-auto hide-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3 mt-1 shrink-0">
                    <Scale size={16} />
                  </div>
                )}

                <div
                  className={`px-6 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-surface border border-border rounded-3xl rounded-tr-sm text-foreground py-4"
                      : "bg-transparent text-foreground leading-relaxed pb-4"
                  }`}
                >
                  {/* Documentation v4 uses 'parts' to handle complex message types */}
                  {msg.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        /* Move the key and classes to the div to stop the TS error */
                        <div
                          key={`${msg.id}-${i}`}
                          className="max-w-none text-foreground"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Add margins to paragraphs
                              p: ({ node, ...props }) => (
                                <p
                                  className="mb-4 leading-relaxed last:mb-0"
                                  {...props}
                                />
                              ),

                              // Style bulleted lists with actual discs and padding
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc pl-6 mb-4 space-y-2"
                                  {...props}
                                />
                              ),

                              // Style numbered lists
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal pl-6 mb-4 space-y-2"
                                  {...props}
                                />
                              ),

                              // List items
                              li: ({ node, ...props }) => (
                                <li className="pl-1" {...props} />
                              ),

                              // Headings
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-2xl font-bold mb-4 mt-6"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-xl font-bold mb-3 mt-5 text-cyan-400"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-lg font-bold mb-2 mt-4"
                                  {...props}
                                />
                              ),

                              // Make bold text pop a bit more in dark mode
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="font-semibold text-white"
                                  {...props}
                                />
                              ),

                              // Keep your code block styling
                              pre: ({ node, ...props }) => (
                                <pre
                                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto"
                                  {...props}
                                />
                              ),
                              code: ({ node, ...props }) => (
                                <code
                                  className="text-cyan-400 font-mono text-sm"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 flex justify-center">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center w-[800px] max-w-full rounded-full py-2 px-4 bg-gradient-accent-blur"
            >
              <textarea
                ref={textareaRefActive}
                value={input}
                onChange={(e) => onTextareaChange(e, textareaRefActive)}
                onKeyDown={onKeyDown}
                rows={1}
                className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70 resize-none overflow-hidden"
                placeholder="Ask a follow-up question..."
              />
              <button
                type="submit"
                className="flex justify-center items-center bg-white rounded-full w-10 h-10 ml-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <ArrowUp size={24} className="text-background" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
