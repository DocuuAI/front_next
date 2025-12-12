"use client";
import { useState } from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  'What documents are due this week?',
  'Show me all GST returns',
  'Which entities have high risk?',
  'Summarize my compliance status'
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI document assistant. I can help you find documents, track deadlines, check compliance, and answer questions about your data. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(input),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('due') || lowerQuery.includes('deadline')) {
      return 'You have 4 upcoming deadlines:\n\n1.  GST Return Filing  - Due in 5 days (Jan 20)\n2.  Legal Notice Response  - Due in 10 days (Jan 25)\n3.  Contract Renewal  - Due in 21 days (Feb 5)\n4.  Tax Payment  - Due in 16 days (Jan 31)\n\nWould you like me to provide more details about any of these?';
    }
    
    if (lowerQuery.includes('gst')) {
      return 'I found 1 GST document in your library:\n\n GST Return Q4 2024.pdf \n- GSTIN: 29ABCDE1234F1Z5\n- Period: Q4 2024\n- Total Tax: ₹1,24,500\n- Status: Processed\n\nWould you like to view this document or check for related deadlines?';
    }
    
    if (lowerQuery.includes('risk')) {
      return 'Based on my analysis, you have:\n\n✅  2 Low Risk Entities \n- Tech Solutions Pvt Ltd\n- Rajesh Kumar\n\n⚠️  1 High Risk Entity \n- Global Imports Ltd (Legal notice pending)\n\nI recommend reviewing the high-risk entity and ensuring timely response to the legal notice.';
    }
    
    if (lowerQuery.includes('compliance')) {
      return ' Compliance Status Overview: \n\n✅  Compliant:  85%\n⚠️  Needs Attention:  15%\n\n Action Items: \n1. Missing PAN verification for Tech Solutions Pvt Ltd\n2. 3 documents need manual categorization\n3. Legal notice response due in 10 days\n\nOverall, your compliance status is good. Focus on the action items to reach 100%.';
    }
    
    return 'I understand your question. Based on your documents and data, I can help you with:\n\n• Document search and retrieval\n• Deadline tracking and reminders\n• Compliance status checks\n• Entity risk assessment\n• Field extraction verification\n\nCould you please provide more specific details about what you\'d like to know?';
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Ask me anything about your documents
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                } rounded-lg p-4`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-xs text-muted-foreground">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Suggested prompts:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />

            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}