import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  asteroid_id: string;
  nickname: string;
  message: string;
  created_at: string;
}

export function useChatMessages(asteroidId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!asteroidId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('asteroid_id', asteroidId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error loading messages',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [asteroidId, toast]);

  // Send a new message
  const sendMessage = useCallback(async (nickname: string, message: string) => {
    if (!asteroidId || !nickname.trim() || !message.trim()) return false;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          asteroid_id: asteroidId,
          nickname: nickname.trim(),
          message: message.trim(),
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [asteroidId, toast]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!asteroidId) return;

    fetchMessages();

    const channel = supabase
      .channel(`chat-${asteroidId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `asteroid_id=eq.${asteroidId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [asteroidId, fetchMessages]);

  return { messages, isLoading, sendMessage, refetch: fetchMessages };
}
