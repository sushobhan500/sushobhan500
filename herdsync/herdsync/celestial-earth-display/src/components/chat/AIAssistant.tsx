import { useState, useRef, useEffect } from 'react';
import { useAsteroidAI, AIMessage } from '@/hooks/useAsteroidAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import type { ProcessedAsteroid } from '@/types/nasa';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  asteroid: ProcessedAsteroid | null;
}

export function AIAssistant({ asteroid }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { askAI, isStreaming, error } = useAsteroidAI(asteroid);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset messages when asteroid changes
  useEffect(() => {
    setMessages([]);
  }, [asteroid?.id]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: AIMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    let assistantContent = '';
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    await askAI(input.trim(), updateAssistant, () => {});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = asteroid ? [
    `Is ${asteroid.name} dangerous?`,
    `How big is ${asteroid.name}?`,
    'What makes an asteroid hazardous?',
  ] : [
    'What are Near-Earth Objects?',
    'How does NASA track asteroids?',
    'What was the DART mission?',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/50 flex items-center gap-2 bg-primary/5">
        <div className="p-1.5 rounded-full bg-primary/20">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm flex items-center gap-1">
            CosmicBot <Sparkles className="h-3 w-3 text-primary" />
          </h4>
          <p className="text-xs text-muted-foreground">
            AI-powered asteroid expert
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Ask me anything about asteroids and Near-Earth Objects!
              </p>
              {asteroid && (
                <p className="text-xs text-primary mt-1">
                  Currently viewing: {asteroid.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 p-1 rounded-full bg-primary/20 h-fit">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/70'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="shrink-0 p-1 rounded-full bg-muted h-fit">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-2">
                <div className="shrink-0 p-1 rounded-full bg-primary/20 h-fit">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-secondary/70 rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-2 mt-2 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about asteroids..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isStreaming}
            className="bg-secondary/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
