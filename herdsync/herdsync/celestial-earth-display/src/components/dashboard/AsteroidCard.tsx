import { cn } from '@/lib/utils';
import type { ProcessedAsteroid } from '@/types/nasa';
import { AlertTriangle, ExternalLink, Gauge, Navigation, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AsteroidCardProps {
  asteroid: ProcessedAsteroid;
  onClick?: () => void;
  onChatClick?: () => void;
  isSelected?: boolean;
}

export function AsteroidCard({ asteroid, onClick, onChatClick, isSelected }: AsteroidCardProps) {
  const riskStyles = {
    critical: 'risk-critical border-destructive/30 bg-destructive/5',
    high: 'risk-high border-warning/30 bg-warning/5',
    moderate: 'border-accent/30 bg-accent/5',
    low: 'risk-low border-safe/30 bg-safe/5',
  };

  const riskBadgeStyles = {
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
    high: 'bg-warning/20 text-warning border-warning/30',
    moderate: 'bg-accent/20 text-accent border-accent/30',
    low: 'bg-safe/20 text-safe border-safe/30',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-4 border-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer group',
        riskStyles[asteroid.riskLevel],
        asteroid.isHazardous && 'pulse-hazard',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {asteroid.isHazardous && (
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
            )}
            <h3 className="font-display text-lg font-bold truncate">
              {asteroid.name}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Close approach: {asteroid.closeApproachDate}
          </p>
        </div>
        
        <Badge
          variant="outline"
          className={cn('uppercase text-xs font-bold', riskBadgeStyles[asteroid.riskLevel])}
        >
          {asteroid.riskLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">Diameter</span>
          </div>
          <p className="font-mono-retro text-lg">
            {asteroid.diameter.toFixed(0)}m
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gauge className="h-3 w-3" />
            <span className="text-xs">Velocity</span>
          </div>
          <p className="font-mono-retro text-lg">
            {asteroid.velocity.toFixed(1)} km/s
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Navigation className="h-3 w-3" />
            <span className="text-xs">Distance</span>
          </div>
          <p className="font-mono-retro text-lg">
            {asteroid.missDistanceLunar.toFixed(1)} LD
          </p>
        </div>
      </div>

      {/* Risk score bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Risk Score</span>
          <span className="font-mono-retro">{asteroid.riskScore}/100</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              asteroid.riskLevel === 'critical' && 'bg-destructive',
              asteroid.riskLevel === 'high' && 'bg-warning',
              asteroid.riskLevel === 'moderate' && 'bg-accent',
              asteroid.riskLevel === 'low' && 'bg-safe'
            )}
            style={{ width: `${Math.min(asteroid.riskScore, 100)}%` }}
          />
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-3 flex items-center justify-between">
        <a
          href={asteroid.nasaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3" />
          View on NASA JPL
        </a>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onChatClick?.();
          }}
        >
          <MessageCircle className="h-3 w-3" />
          Discuss
        </Button>
      </div>
    </div>
  );
}
