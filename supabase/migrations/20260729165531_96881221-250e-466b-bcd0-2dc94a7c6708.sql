
-- PrepChat feed (fully separate from Community)
CREATE TABLE public.prepchat_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  image_url text,
  subject_tag text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prepchat_posts TO authenticated;
GRANT ALL ON public.prepchat_posts TO service_role;
ALTER TABLE public.prepchat_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed in users read doubts" ON public.prepchat_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own doubts" ON public.prepchat_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users update own doubts" ON public.prepchat_posts FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users delete own doubts" ON public.prepchat_posts FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_announcement_admin(auth.uid()));
CREATE TRIGGER prepchat_posts_updated_at BEFORE UPDATE ON public.prepchat_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.prepchat_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.prepchat_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prepchat_comments TO authenticated;
GRANT ALL ON public.prepchat_comments TO service_role;
ALTER TABLE public.prepchat_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed in users read comments" ON public.prepchat_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own comments" ON public.prepchat_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own comments" ON public.prepchat_comments FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_announcement_admin(auth.uid()));

CREATE TABLE public.prepchat_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.prepchat_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.prepchat_likes TO authenticated;
GRANT ALL ON public.prepchat_likes TO service_role;
ALTER TABLE public.prepchat_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed in users read likes" ON public.prepchat_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users like as themselves" ON public.prepchat_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users remove own likes" ON public.prepchat_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.prepchat_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.prepchat_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.prepchat_saves TO authenticated;
GRANT ALL ON public.prepchat_saves TO service_role;
ALTER TABLE public.prepchat_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own saves" ON public.prepchat_saves FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users save as themselves" ON public.prepchat_saves FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users remove own saves" ON public.prepchat_saves FOR DELETE TO authenticated USING (user_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.prepchat_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prepchat_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prepchat_comments;

-- Private chats: remove platform-admin visibility
DROP POLICY "Members read messages" ON public.chat_messages;
CREATE POLICY "Members read messages" ON public.chat_messages FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY "View members of my conversations" ON public.chat_members;
CREATE POLICY "View members of my conversations" ON public.chat_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY "View own or public conversations" ON public.chat_conversations;
CREATE POLICY "View own or public conversations" ON public.chat_conversations FOR SELECT TO authenticated
  USING (is_public OR created_by = auth.uid() OR public.is_conversation_member(id, auth.uid()));
