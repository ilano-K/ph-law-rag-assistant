"use client";

import React, { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "./ChatInput";
import { generateId } from "ai";
import { ChatMessage } from "./ChatMessage";
import { DefaultChatTransport } from "ai";

export default function ChatView() {
  const [chatTitle, setChatTitle] = useState("");
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(() => generateId());

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "api/chat",
      body: { conversationId: chatId },
    }),
    onData: (dataPart) => {
      if (dataPart.type === "data-title") {
        const data = dataPart.data as { title: string };
        setChatTitle(data.title);
      }
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full w-full relative">
      {isEmpty ? (
        /* --- EMPTY STATE (New Thread) --- */
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-10 text-3xl font-legal text-center text-white font-bold">
            Stupid.ai
          </div>
          <ChatInput
            input={input}
            textareaRef={textareaRef}
            onChange={onTextareaChange}
            onKeyDown={onKeyDown}
            onSubmit={handleFormSubmit}
            placeholder="Type a law, e.g., RA 7610..."
            className="mb-40"
          />
        </div>
      ) : (
        /* --- ACTIVE CHAT STATE --- */
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex w-full h-15 justify-center items-center p-2 shrink-0">
            <span className="font-bold">{chatTitle}</span>
          </div>

          <div className="flex-1 p-8 space-y-8 w-full max-w-4xl mx-auto overflow-y-auto hide-scrollbar">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </div>

          <div className="p-6 flex justify-center shrink-0">
            <ChatInput
              input={input}
              textareaRef={textareaRef}
              onChange={onTextareaChange}
              onKeyDown={onKeyDown}
              onSubmit={handleFormSubmit}
              placeholder="Ask a follow-up question..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
