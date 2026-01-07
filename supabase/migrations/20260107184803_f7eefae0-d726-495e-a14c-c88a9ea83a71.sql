-- Add username column to profiles table (unique, required for new users)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Update RLS to allow checking username uniqueness
CREATE POLICY "Anyone can check username availability" 
ON public.profiles 
FOR SELECT 
TO anon
USING (true);