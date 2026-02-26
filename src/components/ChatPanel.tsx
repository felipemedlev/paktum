'use client';

import { useChat } from 'ai/react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send, User, Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatPanelProps {
  contractId: string;
}

import type { Message } from 'ai';

export function ChatPanel({ contractId }: ChatPanelProps) {
  const t = useTranslations('Analysis');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { contractId },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px] border-border shadow-apple-sm">
      <CardHeader className="border-b border-border pb-4 bg-white/60 backdrop-blur-sm rounded-t-2xl">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-accent" />
          </div>
          {t('chatTab')}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f7]/50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            {t('chatPlaceholder')}
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex gap-2.5 max-w-[85%] animate-fade-in ${
                message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center h-7 w-7 rounded-full ${
                message.role === 'user'
                  ? 'bg-accent text-white'
                  : 'bg-white border border-border text-accent'
              }`}>
                {message.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div
                className={`px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-accent text-white rounded-2xl rounded-tr-md'
                    : 'bg-white border border-border text-foreground rounded-2xl rounded-tl-md shadow-apple-sm'
                }`}
              >
                {message.content.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2.5 mr-auto max-w-[85%]">
            <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-white border border-border text-accent">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-border shadow-apple-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t border-border bg-white rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={t('chatPlaceholder')}
            className="flex-1 rounded-xl h-10 bg-[#f5f5f7] border-0 focus-visible:ring-1 focus-visible:ring-accent/30"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-xl h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4 text-white rtl:rotate-180" />
            <span className="sr-only">{t('send')}</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
