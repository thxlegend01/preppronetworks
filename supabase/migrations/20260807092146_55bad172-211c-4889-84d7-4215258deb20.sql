
REVOKE ALL ON FUNCTION public.is_blocked_between(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_conversation_admin(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_conversation_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_post_in_conversation(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_announcement_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_view_room(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.are_friends(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bump_conversation_activity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_blocked_between(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_conversation_admin(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_post_in_conversation(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_announcement_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_room(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.are_friends(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
