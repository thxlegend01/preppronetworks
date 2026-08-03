CREATE TABLE public.prepchat_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'media',
  content text,
  media_url text,
  media_type text,
  background text,
  options text[] NOT NULL DEFAULT '{}',
  correct_option integer,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prepchat_stories TO authenticated;
GRANT ALL ON public.prepchat_stories TO service_role;
ALTER TABLE public.prepchat_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view active stories"
  ON public.prepchat_stories FOR SELECT TO authenticated
  USING (expires_at > now() OR author_id = auth.uid());
CREATE POLICY "Users can create their own stories"
  ON public.prepchat_stories FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can delete their own stories"
  ON public.prepchat_stories FOR DELETE TO authenticated
  USING (author_id = auth.uid());

CREATE INDEX idx_prepchat_stories_active ON public.prepchat_stories (expires_at DESC, created_at DESC);

CREATE TABLE public.prepchat_story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.prepchat_stories(id) ON DELETE CASCADE,
  viewer_id uuid NOT NULL,
  reaction text,
  answer_index integer,
  answer_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (story_id, viewer_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prepchat_story_views TO authenticated;
GRANT ALL ON public.prepchat_story_views TO service_role;
ALTER TABLE public.prepchat_story_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewers and story authors can read views"
  ON public.prepchat_story_views FOR SELECT TO authenticated
  USING (
    viewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.prepchat_stories s WHERE s.id = story_id AND s.author_id = auth.uid())
  );
CREATE POLICY "Users record their own view"
  ON public.prepchat_story_views FOR INSERT TO authenticated
  WITH CHECK (viewer_id = auth.uid());
CREATE POLICY "Users update their own view"
  ON public.prepchat_story_views FOR UPDATE TO authenticated
  USING (viewer_id = auth.uid()) WITH CHECK (viewer_id = auth.uid());
CREATE POLICY "Users delete their own view"
  ON public.prepchat_story_views FOR DELETE TO authenticated
  USING (viewer_id = auth.uid());

ALTER TABLE public.chat_members ADD COLUMN IF NOT EXISTS cleared_at timestamptz;