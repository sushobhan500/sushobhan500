import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  nickname: string;
  message: string;
  createdAt: string;
  isOwn?: boolean;
}

export function ChatMessage({ nickname, message, createdAt, isOwn }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 p-3 rounded-lg",
      isOwn 
        ? "bg-primary/20 border border-primary/30 ml-4" 
        : "bg-secondary/50 border border-border/30 mr-4"
    )}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          "font-semibold text-sm",
          isOwn ? "text-primary" : "text-accent"
        )}>
          {nickname}
        </span>
        <span className="text-xs text-muted-foreground font-mono-retro">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed break-words">
        {message}
      </p>
    </div>
  );
}
