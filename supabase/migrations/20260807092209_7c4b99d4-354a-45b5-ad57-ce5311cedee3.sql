
REVOKE EXECUTE ON FUNCTION public.can_view_room(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.are_friends(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_blocked_between(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_conversation_admin(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.can_post_in_conversation(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
