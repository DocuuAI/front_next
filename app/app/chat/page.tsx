"use client";

import { useEffect, useState } from "react";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const suggestedPrompts = [
  "What documents are due this week?",
  "Show me all gst_number returns",
  "Which entities have high risk?",
  "Summarize my compliance status",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  /* ───────── LOAD CHAT HISTORY ───────── */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/chat", { method: "GET" });
        if (!res.ok) return;

        const data = await res.json();

        if (data.history?.length) {
          setMessages(data.history);
        } else {
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! I'm your AI document assistant. How can I help you today?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    loadHistory();
  }, []);

  /* ───────── SEND MESSAGE ───────── */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "I could not confidently answer that.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "There was an error processing your request.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ───────── CLEAR CHAT ───────── */
  const handleNewChat = async () => {
    try {
      await fetch("/api/chat", { method: "DELETE" });

      setMessages([
        {
          role: "assistant",
          content: "Chat cleared. How can I assist you with your documents?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">AI Assistant</h1>
        </div>
        <Button variant="outline" onClick={handleNewChat}>
          <Trash2 className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      AI Assistant
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-muted-foreground">
              AI is thinking…
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="flex gap-2 flex-wrap">
            {suggestedPrompts.map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="cursor-pointer"
                onClick={() => setInput(p)}
              >
                {p}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}