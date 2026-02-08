import { useState, useCallback } from 'react';
import type { ProcessedAsteroid } from '@/types/nasa';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/asteroid-ai`;

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useAsteroidAI(asteroid: ProcessedAsteroid | null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askAI = useCallback(async (
    message: string,
    onDelta: (text: string) => void,
    onDone: () => void
  ) => {
    setIsStreaming(true);
    setError(null);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message,
          asteroidContext: asteroid ? {
            name: asteroid.name,
            diameter: asteroid.diameter,
            velocity: asteroid.velocity,
            missDistance: asteroid.missDistance,
            missDistanceLunar: asteroid.missDistanceLunar,
            isHazardous: asteroid.isHazardous,
            riskLevel: asteroid.riskLevel,
            riskScore: asteroid.riskScore,
            closeApproachDate: asteroid.closeApproachDate,
          } : null,
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch { /* ignore */ }
        }
      }

      onDone();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      onDone();
    } finally {
      setIsStreaming(false);
    }
  }, [asteroid]);

  return { askAI, isStreaming, error };
}
