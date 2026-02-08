import { useState } from 'react';
import { EarthScene } from '@/components/three/EarthScene';
import { Header } from '@/components/layout/Header';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { AsteroidFeed } from '@/components/dashboard/AsteroidFeed';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector';
import { AsteroidChat } from '@/components/chat/AsteroidChat';
import { useNeoFeed } from '@/hooks/useNasaApi';
import { RefreshCcw } from 'lucide-react';
import type { ProcessedAsteroid } from '@/types/nasa';

const Index = () => {
  const [days, setDays] = useState(7);
  const [selectedAsteroid, setSelectedAsteroid] = useState<ProcessedAsteroid | null>(null);
  const [chatAsteroid, setChatAsteroid] = useState<ProcessedAsteroid | null>(null);
  const { data, isLoading, isError, error, refetch, isFetching } = useNeoFeed(days);

  const handleChatClick = (asteroid: ProcessedAsteroid) => {
    setChatAsteroid(asteroid);
    setSelectedAsteroid(asteroid);
  };

  const handleCloseChat = () => {
    setChatAsteroid(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* 3D Earth Background */}
      <EarthScene />

      {/* Stars overlay */}
      <div className="fixed inset-0 stars-bg pointer-events-none -z-5" />

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <section id="dashboard" className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-2">
                  <span className="gradient-text">Near-Earth Objects</span>
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Real-time tracking of asteroids and comets approaching Earth. Data powered by NASA's NeoWs API.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <DateRangeSelector value={days} onChange={setDays} />
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Error State */}
            {isError && (
              <div className="glass-card rounded-xl p-6 border border-destructive/30 bg-destructive/5 mb-6">
                <p className="text-destructive font-medium">
                  Error loading data: {error?.message || 'Unknown error'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Alert Banner */}
            {data && <AlertBanner asteroids={data.asteroids} />}
          </section>

          {/* Stats Grid */}
          <section className="mb-8">
            <StatsGrid
              stats={
                data?.stats || {
                  totalAsteroids: 0,
                  hazardousCount: 0,
                  averageVelocity: 0,
                  closestApproach: 0,
                }
              }
              isLoading={isLoading}
            />
          </section>

          {/* Main Feed */}
          <section id="feed" className="grid lg:grid-cols-3 gap-6">
            {/* Asteroid List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold">
                  Live Asteroid Feed
                  {data && (
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                      ({data.asteroids.length} objects)
                    </span>
                  )}
                </h3>
              </div>
              <AsteroidFeed
                asteroids={data?.asteroids || []}
                isLoading={isLoading}
                selectedAsteroid={selectedAsteroid}
                onSelectAsteroid={setSelectedAsteroid}
                onChatClick={handleChatClick}
              />
            </div>

            {/* Sidebar Info / Chat */}
            <div className="space-y-6">
              {/* Chat Panel */}
              {chatAsteroid && (
                <AsteroidChat
                  asteroid={chatAsteroid}
                  onClose={handleCloseChat}
                />
              )}

              {/* About Card */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="font-display text-lg font-bold mb-3 gradient-text">
                  About Cosmic Watch
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cosmic Watch is a real-time monitoring platform for Near-Earth Objects (NEOs). 
                  We process data from NASA's NeoWs API to provide clear risk assessments and 
                  proximity alerts for asteroids approaching Earth.
                </p>
              </div>

              {/* Risk Legend */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="font-display text-lg font-bold mb-4">Risk Levels</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-sm">
                      <span className="font-semibold text-destructive">Critical</span>
                      <span className="text-muted-foreground"> — Immediate attention</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-sm">
                      <span className="font-semibold text-warning">High</span>
                      <span className="text-muted-foreground"> — Close monitoring</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-sm">
                      <span className="font-semibold text-accent">Moderate</span>
                      <span className="text-muted-foreground"> — Standard tracking</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-safe" />
                    <span className="text-sm">
                      <span className="font-semibold text-safe">Low</span>
                      <span className="text-muted-foreground"> — No concern</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Source */}
              <div className="glass-card rounded-xl p-6">
                <h4 className="font-display text-lg font-bold mb-3">Data Source</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Powered by NASA's Near Earth Object Web Service (NeoWs).
                </p>
                <a
                  href="https://api.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Learn more about NASA APIs →
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="glass-card border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 Cosmic Watch. Data provided by NASA NeoWs API.
              </p>
              <p className="text-xs text-muted-foreground font-mono-retro">
                Last refresh: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
