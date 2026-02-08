import { cn } from '@/lib/utils';
import type { DashboardStats } from '@/types/nasa';
import { AlertTriangle, Gauge, Navigation, Telescope } from 'lucide-react';

interface StatsGridProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statCards = [
    {
      label: 'Tracked Objects',
      value: stats.totalAsteroids,
      icon: Telescope,
      format: (v: number) => v.toString(),
      accent: 'primary',
    },
    {
      label: 'Hazardous',
      value: stats.hazardousCount,
      icon: AlertTriangle,
      format: (v: number) => v.toString(),
      accent: 'destructive',
    },
    {
      label: 'Avg Velocity',
      value: stats.averageVelocity,
      icon: Gauge,
      format: (v: number) => `${v.toFixed(1)} km/s`,
      accent: 'accent',
    },
    {
      label: 'Closest Approach',
      value: stats.closestApproach,
      icon: Navigation,
      format: (v: number) => {
        if (v < 1000000) return `${(v / 1000).toFixed(0)}k km`;
        return `${(v / 1000000).toFixed(2)}M km`;
      },
      accent: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'glass-card rounded-xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]',
            isLoading && 'animate-pulse'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {stat.label}
              </p>
              <p
                className={cn(
                  'text-2xl lg:text-3xl font-display font-bold',
                  stat.accent === 'destructive' && 'text-destructive',
                  stat.accent === 'warning' && 'text-warning',
                  stat.accent === 'primary' && 'text-primary',
                  stat.accent === 'accent' && 'text-accent'
                )}
              >
                {isLoading ? '—' : stat.format(stat.value)}
              </p>
            </div>
            <stat.icon
              className={cn(
                'h-8 w-8 opacity-50',
                stat.accent === 'destructive' && 'text-destructive',
                stat.accent === 'warning' && 'text-warning',
                stat.accent === 'primary' && 'text-primary',
                stat.accent === 'accent' && 'text-accent'
              )}
            />
          </div>
          
          {/* Glow effect */}
          <div
            className={cn(
              'absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-2xl',
              stat.accent === 'destructive' && 'bg-destructive',
              stat.accent === 'warning' && 'bg-warning',
              stat.accent === 'primary' && 'bg-primary',
              stat.accent === 'accent' && 'bg-accent'
            )}
          />
        </div>
      ))}
    </div>
  );
}
