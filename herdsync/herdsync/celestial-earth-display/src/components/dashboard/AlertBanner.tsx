import { cn } from '@/lib/utils';
import type { ProcessedAsteroid } from '@/types/nasa';
import { AlertTriangle, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertBannerProps {
  asteroids: ProcessedAsteroid[];
}

export function AlertBanner({ asteroids }: AlertBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const criticalAsteroids = asteroids.filter(
    (a) => a.riskLevel === 'critical' || a.riskLevel === 'high'
  );

  useEffect(() => {
    if (criticalAsteroids.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % criticalAsteroids.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [criticalAsteroids.length]);

  if (criticalAsteroids.length === 0) {
    return (
      <div className="glass-card rounded-xl p-4 border border-safe/30 bg-safe/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-safe/20">
            <Bell className="h-5 w-5 text-safe" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-safe">All Clear</p>
            <p className="text-sm text-muted-foreground">
              No high-risk asteroids detected in the monitoring period
            </p>
          </div>
        </div>
      </div>
    );
  }

  const current = criticalAsteroids[currentIndex];

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-4 border-2 transition-all duration-500',
        current.riskLevel === 'critical'
          ? 'border-destructive/50 bg-destructive/10 pulse-hazard'
          : 'border-warning/50 bg-warning/10'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-2 rounded-lg',
              current.riskLevel === 'critical' ? 'bg-destructive/20' : 'bg-warning/20'
            )}
          >
            <AlertTriangle
              className={cn(
                'h-5 w-5',
                current.riskLevel === 'critical' ? 'text-destructive' : 'text-warning'
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  'font-display text-lg font-bold',
                  current.riskLevel === 'critical' ? 'text-destructive' : 'text-warning'
                )}
              >
                {current.riskLevel.toUpperCase()} RISK ALERT
              </p>
              {criticalAsteroids.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  ({currentIndex + 1}/{criticalAsteroids.length})
                </span>
              )}
            </div>
            <p className="text-sm text-foreground">
              <span className="font-semibold">{current.name}</span>
              {' — '}
              {current.diameter.toFixed(0)}m diameter approaching at{' '}
              {current.velocity.toFixed(1)} km/s
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Closest approach: {current.closeApproachDate} •{' '}
              {current.missDistanceLunar.toFixed(1)} Lunar Distances
            </p>
          </div>
        </div>
        
        <a
          href={current.nasaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'px-4 py-2 rounded-lg font-display font-bold text-sm transition-all hover:scale-105',
            current.riskLevel === 'critical'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-warning text-warning-foreground'
          )}
        >
          Details
        </a>
      </div>
    </div>
  );
}
