-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.conversation_type AS ENUM ('dm', 'group', 'channel');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.conversation_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CONVERSATIONS
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.conversation_type NOT NULL DEFAULT 'group',
  title text,
  description text,
  avatar_url text,
  is_public boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_conversations TO authenticated;
GRANT ALL ON public.chat_conversations TO service_role;

-- MEMBERS
CREATE TABLE public.chat_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.conversation_role NOT NULL DEFAULT 'member',
  muted boolean NOT NULL DEFAULT false,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_members TO authenticated;
GRANT ALL ON public.chat_members TO service_role;

-- MESSAGES
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text,
  media_url text,
  media_type text,
  media_name text,
  reply_to_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  is_edited boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false,
  deleted_for uuid[] NOT NULL DEFAULT '{}',
  deleted_for_everyone boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

-- REACTIONS
CREATE TABLE public.chat_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
GRANT SELECT, INSERT, DELETE ON public.chat_message_reactions TO authenticated;
GRANT ALL ON public.chat_message_reactions TO service_role;

-- FOLLOWS
CREATE TABLE public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_follows TO authenticated;
GRANT ALL ON public.user_follows TO service_role;

-- SAVED POSTS
CREATE TABLE public.post_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_saves TO authenticated;
GRANT ALL ON public.post_saves TO service_role;

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS subject_tag text;

-- HELPER FUNCTIONS (security definer, avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.chat_members WHERE conversation_id = _conversation_id AND user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_conversation_admin(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE conversation_id = _conversation_id AND user_id = _user_id AND role IN ('owner','admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.can_post_in_conversation(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN (SELECT type FROM public.chat_conversations WHERE id = _conversation_id) = 'channel'
      THEN public.is_conversation_admin(_conversation_id, _user_id)
    ELSE public.is_conversation_member(_conversation_id, _user_id)
  END
$$;

-- RLS: conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own or public conversations" ON public.chat_conversations
FOR SELECT TO authenticated
USING (is_public OR created_by = auth.uid() OR public.is_conversation_member(id, auth.uid()) OR public.is_announcement_admin(auth.uid()));

CREATE POLICY "Create conversations" ON public.chat_conversations
FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins update conversations" ON public.chat_conversations
FOR UPDATE TO authenticated
USING (public.is_conversation_admin(id, auth.uid()) OR created_by = auth.uid())
WITH CHECK (public.is_conversation_admin(id, auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Owner deletes conversation" ON public.chat_conversations
FOR DELETE TO authenticated USING (created_by = auth.uid());

-- RLS: members
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View members of my conversations" ON public.chat_members
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()) OR public.is_announcement_admin(auth.uid()));

CREATE POLICY "Join or add members" ON public.chat_members
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR public.is_conversation_admin(conversation_id, auth.uid())
  OR EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = conversation_id AND c.created_by = auth.uid())
);

CREATE POLICY "Update own membership" ON public.chat_members
FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.is_conversation_admin(conversation_id, auth.uid()))
WITH CHECK (user_id = auth.uid() OR public.is_conversation_admin(conversation_id, auth.uid()));

CREATE POLICY "Leave or remove members" ON public.chat_members
FOR DELETE TO authenticated
USING (user_id = auth.uid() OR public.is_conversation_admin(conversation_id, auth.uid()));

-- RLS: messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read messages" ON public.chat_messages
FOR SELECT TO authenticated
USING (public.is_conversation_member(conversation_id, auth.uid()) OR public.is_announcement_admin(auth.uid()));

CREATE POLICY "Allowed users send messages" ON public.chat_messages
FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND public.can_post_in_conversation(conversation_id, auth.uid()));

CREATE POLICY "Edit own messages" ON public.chat_messages
FOR UPDATE TO authenticated
USING (sender_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()))
WITH CHECK (sender_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()));

CREATE POLICY "Delete own messages" ON public.chat_messages
FOR DELETE TO authenticated
USING (sender_id = auth.uid() OR public.is_conversation_admin(conversation_id, auth.uid()));

-- RLS: reactions
ALTER TABLE public.chat_message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read reactions" ON public.chat_message_reactions
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.chat_messages m
  WHERE m.id = message_id AND public.is_conversation_member(m.conversation_id, auth.uid())
));

CREATE POLICY "Members react" ON public.chat_message_reactions
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND EXISTS (
  SELECT 1 FROM public.chat_messages m
  WHERE m.id = message_id AND public.is_conversation_member(m.conversation_id, auth.uid())
));

CREATE POLICY "Remove own reaction" ON public.chat_message_reactions
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS: follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can view follows" ON public.user_follows
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Follow others" ON public.user_follows
FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Unfollow" ON public.user_follows
FOR DELETE TO authenticated USING (follower_id = auth.uid());

-- RLS: saves
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own saves" ON public.post_saves
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Save posts" ON public.post_saves
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Unsave posts" ON public.post_saves
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- TRIGGERS
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.bump_conversation_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.chat_conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER bump_conversation_on_message
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_activity();

-- INDEXES
CREATE INDEX idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at DESC);
CREATE INDEX idx_chat_members_user ON public.chat_members(user_id);
CREATE INDEX idx_chat_members_conv ON public.chat_members(conversation_id);
CREATE INDEX idx_user_follows_following ON public.user_follows(following_id);

-- REALTIME
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_members REPLICA IDENTITY FULL;
ALTER TABLE public.chat_message_reactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_message_reactions;