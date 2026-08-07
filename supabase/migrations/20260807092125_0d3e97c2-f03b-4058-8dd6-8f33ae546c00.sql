
-- 1. Roles system
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- seed existing admins
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email IN ('thxlegend01era@gmail.com','saurabhsaroj2010@gmail.com','manojadeviaw@gmail.com','saurabh20103060@gmail.com')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_announcement_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin')
$$;

-- 2. blocked_users write protection (admins only)
DROP POLICY IF EXISTS "Admins can block users" ON public.blocked_users;
CREATE POLICY "Admins can block users" ON public.blocked_users
FOR INSERT TO authenticated WITH CHECK (public.is_announcement_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update blocks" ON public.blocked_users;
CREATE POLICY "Admins can update blocks" ON public.blocked_users
FOR UPDATE TO authenticated USING (public.is_announcement_admin(auth.uid()))
WITH CHECK (public.is_announcement_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can unblock users" ON public.blocked_users;
CREATE POLICY "Admins can unblock users" ON public.blocked_users
FOR DELETE TO authenticated USING (public.is_announcement_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can read blocks" ON public.blocked_users;
CREATE POLICY "Admins can read blocks" ON public.blocked_users
FOR SELECT TO authenticated USING (public.is_announcement_admin(auth.uid()));

-- 3. Study room access helpers
CREATE OR REPLACE FUNCTION public.can_view_room(_room_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.study_rooms r
    WHERE r.id = _room_id
      AND (r.is_global OR r.created_by = _user_id
           OR EXISTS (SELECT 1 FROM public.room_participants p WHERE p.room_id = r.id AND p.user_id = _user_id))
  )
$$;

CREATE OR REPLACE FUNCTION public.are_friends(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.friends WHERE (user_id = _a AND friend_id = _b) OR (user_id = _b AND friend_id = _a))
$$;

DROP POLICY IF EXISTS "Anyone can read rooms" ON public.study_rooms;
CREATE POLICY "Members can read rooms" ON public.study_rooms
FOR SELECT TO authenticated
USING (is_global OR created_by = auth.uid()
       OR EXISTS (SELECT 1 FROM public.room_participants p WHERE p.room_id = study_rooms.id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can read participants" ON public.room_participants;
CREATE POLICY "Members can read participants" ON public.room_participants
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.can_view_room(room_id, auth.uid()));

DROP POLICY IF EXISTS "Anyone can read room messages" ON public.room_messages;
CREATE POLICY "Members can read room messages" ON public.room_messages
FOR SELECT TO authenticated
USING (public.can_view_room(room_id, auth.uid()));

DROP POLICY IF EXISTS "Anyone can read reactions" ON public.message_reactions;
CREATE POLICY "Members can read reactions" ON public.message_reactions
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.room_messages m
  WHERE m.id = message_reactions.message_id AND public.can_view_room(m.room_id, auth.uid())
));

-- 4. Presence visibility
DROP POLICY IF EXISTS "Anyone can read presence" ON public.user_presence;
CREATE POLICY "Presence visible to self, friends and public profiles" ON public.user_presence
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.are_friends(auth.uid(), user_id)
  OR NOT EXISTS (
    SELECT 1 FROM public.user_study_profiles sp
    WHERE sp.user_id = user_presence.user_id AND sp.visibility <> 'public'
  )
);

-- 5. owner_messages read-status update needs WITH CHECK
DROP POLICY IF EXISTS "User or admin update read" ON public.owner_messages;
CREATE POLICY "User or admin update read" ON public.owner_messages
FOR UPDATE TO authenticated
USING ((auth.uid() = user_id) OR public.is_announcement_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR public.is_announcement_admin(auth.uid()));

-- 6. Lock down trigger-only SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bump_conversation_activity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_blocked_between(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_conversation_admin(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_conversation_member(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.can_post_in_conversation(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_announcement_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.can_view_room(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.are_friends(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
