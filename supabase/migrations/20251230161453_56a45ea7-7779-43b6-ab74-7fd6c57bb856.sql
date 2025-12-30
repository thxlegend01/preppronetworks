-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create user_study_sessions table for hour tracking
CREATE TABLE public.user_study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on study sessions
ALTER TABLE public.user_study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for study sessions
CREATE POLICY "Users can view their own study sessions" 
ON public.user_study_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions" 
ON public.user_study_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" 
ON public.user_study_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user_favorites table for bookmarks
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('batch', 'test', 'material')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable RLS on favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create recently_viewed table
CREATE TABLE public.user_recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_title TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS on recently viewed
ALTER TABLE public.user_recently_viewed ENABLE ROW LEVEL SECURITY;

-- RLS policies for recently viewed
CREATE POLICY "Users can view their own recently viewed" 
ON public.user_recently_viewed 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed" 
ON public.user_recently_viewed 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed" 
ON public.user_recently_viewed 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recently viewed" 
ON public.user_recently_viewed 
FOR DELETE 
USING (auth.uid() = user_id);