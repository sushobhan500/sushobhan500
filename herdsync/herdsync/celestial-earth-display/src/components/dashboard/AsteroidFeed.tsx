import { cn } from '@/lib/utils';
import type { ProcessedAsteroid } from '@/types/nasa';
import { AsteroidCard } from './AsteroidCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AsteroidFeedProps {
  asteroids: ProcessedAsteroid[];
  isLoading?: boolean;
  selectedAsteroid?: ProcessedAsteroid | null;
  onSelectAsteroid?: (asteroid: ProcessedAsteroid) => void;
  onChatClick?: (asteroid: ProcessedAsteroid) => void;
}

export function AsteroidFeed({ asteroids, isLoading, selectedAsteroid, onSelectAsteroid, onChatClick }: AsteroidFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-4 h-40 animate-pulse"
          >
            <div className="h-4 w-48 bg-muted rounded mb-2" />
            <div className="h-3 w-32 bg-muted/50 rounded mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-8 bg-muted/30 rounded" />
              <div className="h-8 bg-muted/30 rounded" />
              <div className="h-8 bg-muted/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (asteroids.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No asteroids found for this period.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-320px)] custom-scrollbar">
      <div className="space-y-4 pr-4">
        {asteroids.map((asteroid, index) => (
          <div
            key={asteroid.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <AsteroidCard
              asteroid={asteroid}
              isSelected={selectedAsteroid?.id === asteroid.id}
              onClick={() => onSelectAsteroid?.(asteroid)}
              onChatClick={() => onChatClick?.(asteroid)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
