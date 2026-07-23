
-- =========================================================
-- DIRECT MESSAGES (1-on-1 user chat, admin-monitored)
-- =========================================================
CREATE TABLE public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  media_name TEXT,
  reply_to_id UUID REFERENCES public.direct_messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  deleted_for_everyone BOOLEAN NOT NULL DEFAULT false,
  deleted_for UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (sender_id <> recipient_id)
);

CREATE INDEX idx_dm_pair ON public.direct_messages (
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id),
  created_at DESC
);
CREATE INDEX idx_dm_recipient ON public.direct_messages (recipient_id, created_at DESC);
CREATE INDEX idx_dm_sender ON public.direct_messages (sender_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated;
GRANT ALL ON public.direct_messages TO service_role;

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants or admin can read DMs"
ON public.direct_messages FOR SELECT TO authenticated
USING (
  auth.uid() = sender_id
  OR auth.uid() = recipient_id
  OR public.is_announcement_admin(auth.uid())
);

CREATE POLICY "Users send DMs as themselves"
ON public.direct_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Sender/recipient/admin can update DMs"
ON public.direct_messages FOR UPDATE TO authenticated
USING (
  auth.uid() = sender_id
  OR auth.uid() = recipient_id
  OR public.is_announcement_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = sender_id
  OR auth.uid() = recipient_id
  OR public.is_announcement_admin(auth.uid())
);

CREATE POLICY "Sender or admin can delete DMs"
ON public.direct_messages FOR DELETE TO authenticated
USING (
  auth.uid() = sender_id
  OR public.is_announcement_admin(auth.uid())
);

CREATE TRIGGER update_direct_messages_updated_at
BEFORE UPDATE ON public.direct_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- =========================================================
-- DM HIDDEN THREADS (per-user "delete chat for me")
-- =========================================================
CREATE TABLE public.dm_hidden_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hidden_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, partner_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dm_hidden_threads TO authenticated;
GRANT ALL ON public.dm_hidden_threads TO service_role;

ALTER TABLE public.dm_hidden_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own hidden threads"
ON public.dm_hidden_threads FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- USER BLOCKS (user-to-user block, distinct from admin ban)
-- =========================================================
CREATE TABLE public.user_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

-- Users can see blocks that involve them (needed for the "did they block me?" check)
CREATE POLICY "Users read blocks involving them"
ON public.user_blocks FOR SELECT TO authenticated
USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

CREATE POLICY "Users create their own blocks"
ON public.user_blocks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users remove their own blocks"
ON public.user_blocks FOR DELETE TO authenticated
USING (auth.uid() = blocker_id);

-- =========================================================
-- Helper: is either side blocked?
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_blocked_between(a UUID, b UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = a AND blocked_id = b)
       OR (blocker_id = b AND blocked_id = a)
  )
$$;

-- =========================================================
-- Public profile lookup by username (for /u/:username)
-- Everyone can read basic public profile fields already,
-- but make sure anon+authenticated can look up by username.
-- =========================================================
GRANT SELECT ON public.profiles TO anon;
