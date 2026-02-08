import { useState } from 'react';
import { AsteroidChat } from './AsteroidChat';
import { AIAssistant } from './AIAssistant';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Bot, X } from 'lucide-react';
import type { ProcessedAsteroid } from '@/types/nasa';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  selectedAsteroid: ProcessedAsteroid | null;
  onSelectAsteroid: (asteroid: ProcessedAsteroid | null) => void;
}

export function ChatPanel({ selectedAsteroid, onSelectAsteroid }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'community'>('ai');

  const handleOpen = () => {
    if (selectedAsteroid) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating chat button when asteroid is selected but chat is closed */}
      {selectedAsteroid && !isOpen && (
        <Button
          onClick={handleOpen}
          className={cn(
            "fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg",
            "bg-primary hover:bg-primary/90 animate-pulse"
          )}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat panel */}
      {isOpen && selectedAsteroid && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] shadow-2xl glass-card rounded-xl overflow-hidden">
          {/* Header with tabs */}
          <div className="border-b border-border/50 bg-secondary/30">
            <div className="flex items-center justify-between px-3 pt-3">
              <div className="text-sm font-display font-bold truncate max-w-[280px]">
                {selectedAsteroid.name}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ai' | 'community')} className="w-full">
              <TabsList className="w-full rounded-none bg-transparent border-b border-border/30 h-10">
                <TabsTrigger 
                  value="ai" 
                  className="flex-1 gap-1.5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <Bot className="h-3.5 w-3.5" />
                  AI Expert
                </TabsTrigger>
                <TabsTrigger 
                  value="community" 
                  className="flex-1 gap-1.5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="m-0 h-[450px]">
                <AIAssistant asteroid={selectedAsteroid} />
              </TabsContent>

              <TabsContent value="community" className="m-0">
                <AsteroidChat 
                  asteroid={selectedAsteroid} 
                  onClose={handleClose}
                  hideHeader
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
