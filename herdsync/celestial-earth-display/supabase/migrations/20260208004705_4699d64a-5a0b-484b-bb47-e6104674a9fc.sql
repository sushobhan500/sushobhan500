-- Create chat messages table for asteroid discussions
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asteroid_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages (public chat)
CREATE POLICY "Anyone can read chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Allow anyone to insert messages (anonymous chat with nickname)
CREATE POLICY "Anyone can insert chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create index for faster asteroid-specific queries
CREATE INDEX idx_chat_messages_asteroid_id ON public.chat_messages(asteroid_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);