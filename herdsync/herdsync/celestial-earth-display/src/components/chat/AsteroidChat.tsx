import { useState, useRef, useEffect } from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatMessage } from './ChatMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, X } from 'lucide-react';
import type { ProcessedAsteroid } from '@/types/nasa';

interface AsteroidChatProps {
  asteroid: ProcessedAsteroid | null;
  onClose: () => void;
  hideHeader?: boolean;
}

const NICKNAME_STORAGE_KEY = 'cosmic-watch-nickname';

export function AsteroidChat({ asteroid, onClose, hideHeader = false }: AsteroidChatProps) {
  const [nickname, setNickname] = useState(() => 
    localStorage.getItem(NICKNAME_STORAGE_KEY) || ''
  );
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage } = useChatMessages(asteroid?.id || null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save nickname to localStorage
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    localStorage.setItem(NICKNAME_STORAGE_KEY, value);
  };

  const handleSend = async () => {
    if (!message.trim() || !nickname.trim() || isSending) return;
    
    setIsSending(true);
    const success = await sendMessage(nickname, message);
    if (success) {
      setMessage('');
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!asteroid) return null;

  return (
    <div className={`flex flex-col ${hideHeader ? 'h-[450px]' : 'h-[500px] glass-card rounded-xl overflow-hidden'}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display font-bold text-sm">
                {asteroid.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Community Discussion
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                nickname={msg.nickname}
                message={msg.message}
                createdAt={msg.created_at}
                isOwn={msg.nickname === nickname}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 space-y-3 bg-background/50">
        {/* Nickname input */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Your name:
          </span>
          <Input
            placeholder="Enter nickname..."
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            className="h-8 text-sm bg-secondary/50"
            maxLength={20}
          />
        </div>
        
        {/* Message input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!nickname.trim() || isSending}
            className="bg-secondary/50"
            maxLength={500}
          />
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || !nickname.trim() || isSending}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
