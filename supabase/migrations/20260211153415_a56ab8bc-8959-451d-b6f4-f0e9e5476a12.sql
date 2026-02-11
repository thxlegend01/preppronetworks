
-- Enum for timer modes
CREATE TYPE public.timer_mode AS ENUM ('normal', 'pomodoro_25_5', 'pomodoro_50_10');

-- Enum for user presence status
CREATE TYPE public.presence_status AS ENUM ('online', 'offline', 'studying', 'break');

-- Enum for visibility settings
CREATE TYPE public.visibility_setting AS ENUM ('public', 'friends_only', 'private');

-- Enum for friend request status
CREATE TYPE public.friend_request_status AS ENUM ('pending', 'accepted', 'rejected');

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT DEFAULT 'book',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subjects" ON public.subjects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enhanced study sessions
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  mode timer_mode NOT NULL DEFAULT 'normal',
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_tick_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_study_sessions_user_active ON public.study_sessions(user_id, is_active);
CREATE INDEX idx_study_sessions_user_date ON public.study_sessions(user_id, started_at);

-- User goals
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  daily_goal_minutes INTEGER NOT NULL DEFAULT 120,
  weekly_goal_minutes INTEGER NOT NULL DEFAULT 600,
  streak_minimum_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goals" ON public.user_goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subject-wise goals
CREATE TABLE public.subject_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id)
);
ALTER TABLE public.subject_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subject goals" ON public.subject_goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User streaks
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- User presence
CREATE TABLE public.user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status presence_status NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read presence" ON public.user_presence FOR SELECT USING (true);
CREATE POLICY "Users manage own presence" ON public.user_presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own presence" ON public.user_presence FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for presence
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- Study rooms
CREATE TABLE public.study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  is_global BOOLEAN NOT NULL DEFAULT false,
  max_participants INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read rooms" ON public.study_rooms FOR SELECT USING (true);
CREATE POLICY "Auth users create rooms" ON public.study_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners delete rooms" ON public.study_rooms FOR DELETE USING (auth.uid() = created_by);

-- Room participants
CREATE TABLE public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read participants" ON public.room_participants FOR SELECT USING (true);
CREATE POLICY "Users join rooms" ON public.room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave rooms" ON public.room_participants FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;

-- Friend requests
CREATE TABLE public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  status friend_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own requests" ON public.friend_requests FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users send requests" ON public.friend_requests FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users update received requests" ON public.friend_requests FOR UPDATE USING (auth.uid() = to_user_id);

-- Friends (denormalized for fast lookups)
CREATE TABLE public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own friends" ON public.friends FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add friends" ON public.friends FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove friends" ON public.friends FOR DELETE USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON public.user_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;

-- User extended profile for study tracker
CREATE TABLE public.user_study_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_exam TEXT DEFAULT 'JEE',
  visibility visibility_setting NOT NULL DEFAULT 'public',
  notification_friend_online BOOLEAN NOT NULL DEFAULT true,
  notification_friend_studying BOOLEAN NOT NULL DEFAULT true,
  notification_streak BOOLEAN NOT NULL DEFAULT true,
  notification_goals BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_study_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles readable" ON public.user_study_profiles FOR SELECT USING (
  visibility = 'public' OR auth.uid() = user_id
);
CREATE POLICY "Users manage own study profile" ON public.user_study_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own study profile" ON public.user_study_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Motivational quotes
CREATE TABLE public.motivational_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT
);
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read quotes" ON public.motivational_quotes FOR SELECT USING (true);

-- Insert some motivational quotes
INSERT INTO public.motivational_quotes (quote, author) VALUES
('The secret of getting ahead is getting started.', 'Mark Twain'),
('It does not matter how slowly you go as long as you do not stop.', 'Confucius'),
('Success is the sum of small efforts repeated day in and day out.', 'Robert Collier'),
('The only way to do great work is to love what you do.', 'Steve Jobs'),
('Education is the most powerful weapon which you can use to change the world.', 'Nelson Mandela'),
('Hard work beats talent when talent does not work hard.', 'Tim Notke'),
('Don''t watch the clock; do what it does. Keep going.', 'Sam Levenson'),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt'),
('Believe you can and you''re halfway there.', 'Theodore Roosevelt'),
('Push yourself, because no one else is going to do it for you.', 'Unknown'),
('Wake up with determination. Go to bed with satisfaction.', 'Unknown'),
('Dream big. Start small. Act now.', 'Robin Sharma'),
('You don''t have to be great to start, but you have to start to be great.', 'Zig Ziglar'),
('Discipline is the bridge between goals and accomplishment.', 'Jim Rohn'),
('Small daily improvements over time lead to stunning results.', 'Robin Sharma');

-- Enable realtime for study sessions (for live leaderboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions;
