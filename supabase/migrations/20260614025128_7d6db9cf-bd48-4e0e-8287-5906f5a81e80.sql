
ALTER TABLE public.owner_messages
  ADD COLUMN IF NOT EXISTS media_url text,
  ADD COLUMN IF NOT EXISTS media_type text,
  ADD COLUMN IF NOT EXISTS media_name text,
  ADD COLUMN IF NOT EXISTS is_edited boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP POLICY IF EXISTS "Senders can update their own owner messages" ON public.owner_messages;
CREATE POLICY "Senders can update their own owner messages"
ON public.owner_messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid() OR public.is_announcement_admin(auth.uid()))
WITH CHECK (sender_id = auth.uid() OR public.is_announcement_admin(auth.uid()));

DROP POLICY IF EXISTS "Senders or admins can delete owner messages" ON public.owner_messages;
CREATE POLICY "Senders or admins can delete owner messages"
ON public.owner_messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid() OR public.is_announcement_admin(auth.uid()));
