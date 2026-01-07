-- Add blocked_users table to track restricted users
CREATE TABLE public.blocked_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_by TEXT,
  reason TEXT
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Only allow reading blocked status (for checking if user is blocked)
CREATE POLICY "Anyone can check if a user is blocked"
ON public.blocked_users
FOR SELECT
TO authenticated
USING (true);