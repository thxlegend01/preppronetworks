
-- Refresh admin email list
CREATE OR REPLACE FUNCTION public.is_announcement_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
    AND email IN (
      'thxlegend01era@gmail.com',
      'saurabhsaroj2010@gmail.com',
      'manojadeviaw@gmail.com',
      'saurabh20103060@gmail.com'
    )
  )
$$;

-- Community banned users (separate from blocked_users)
CREATE TABLE public.community_banned_users (
  user_id uuid PRIMARY KEY,
  banned_by uuid,
  reason text,
  banned_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.community_banned_users TO authenticated;
GRANT ALL ON public.community_banned_users TO service_role;
ALTER TABLE public.community_banned_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone auth can read bans" ON public.community_banned_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage bans ins" ON public.community_banned_users FOR INSERT TO authenticated WITH CHECK (public.is_announcement_admin(auth.uid()));
CREATE POLICY "Admins manage bans del" ON public.community_banned_users FOR DELETE TO authenticated USING (public.is_announcement_admin(auth.uid()));

-- Community posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone auth can read posts" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins create posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (public.is_announcement_admin(auth.uid()) AND auth.uid() = author_id);
CREATE POLICY "Admins update posts" ON public.community_posts FOR UPDATE TO authenticated USING (public.is_announcement_admin(auth.uid()));
CREATE POLICY "Admins delete posts" ON public.community_posts FOR DELETE TO authenticated USING (public.is_announcement_admin(auth.uid()));

CREATE TRIGGER community_posts_set_updated_at BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Community reactions
CREATE TABLE public.community_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, emoji)
);
GRANT SELECT, INSERT, DELETE ON public.community_reactions TO authenticated;
GRANT ALL ON public.community_reactions TO service_role;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone auth can read reactions" ON public.community_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Non-banned add reactions" ON public.community_reactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND NOT EXISTS (SELECT 1 FROM public.community_banned_users b WHERE b.user_id = auth.uid()));
CREATE POLICY "Users remove own reactions" ON public.community_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Community comments
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.community_comments TO authenticated;
GRANT ALL ON public.community_comments TO service_role;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone auth can read comments" ON public.community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Non-banned add comments" ON public.community_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND NOT EXISTS (SELECT 1 FROM public.community_banned_users b WHERE b.user_id = auth.uid()));
CREATE POLICY "Author or admin delete comments" ON public.community_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_announcement_admin(auth.uid()));

-- Owner DMs: user_id = the non-owner participant. from_owner indicates direction.
CREATE TABLE public.owner_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  from_owner boolean NOT NULL DEFAULT false,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX owner_messages_user_id_idx ON public.owner_messages(user_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.owner_messages TO authenticated;
GRANT ALL ON public.owner_messages TO service_role;
ALTER TABLE public.owner_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own thread or admin all" ON public.owner_messages FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_announcement_admin(auth.uid()));

CREATE POLICY "User sends in own thread" ON public.owner_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      (auth.uid() = user_id AND from_owner = false)
      OR (public.is_announcement_admin(auth.uid()) AND from_owner = true)
    )
  );

CREATE POLICY "User or admin update read" ON public.owner_messages FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_announcement_admin(auth.uid()));

CREATE POLICY "Admin delete messages" ON public.owner_messages FOR DELETE TO authenticated
  USING (public.is_announcement_admin(auth.uid()));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.owner_messages;
