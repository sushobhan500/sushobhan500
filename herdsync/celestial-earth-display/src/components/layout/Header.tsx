import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-card border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl lg:text-2xl font-bold tracking-wider">
                <span className="gradient-text">COSMIC</span>{' '}
                <span className="text-foreground">WATCH</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                NEO Monitoring Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#dashboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#feed"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Live Feed
            </a>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              NASA API
            </a>
          </nav>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
              </span>
              <span className="text-xs font-medium text-safe">LIVE</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3 border-t border-border/50 mt-4">
            <a
              href="#dashboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#feed"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Live Feed
            </a>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              NASA API
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
