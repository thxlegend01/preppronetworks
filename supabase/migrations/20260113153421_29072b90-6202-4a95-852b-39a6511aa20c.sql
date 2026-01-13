-- Fix security issues: Restrict public access to profiles and blocked_users tables

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can check if a user is blocked" ON public.blocked_users;
DROP POLICY IF EXISTS "Anyone can check username availability" ON public.profiles;

-- Create more secure policies for profiles
-- Only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create secure policy for blocked_users
-- Only the user who blocked or was blocked can see the record
CREATE POLICY "Users can only see their own block records" 
ON public.blocked_users 
FOR SELECT 
USING (auth.uid()::text = blocked_by OR auth.uid() = user_id);