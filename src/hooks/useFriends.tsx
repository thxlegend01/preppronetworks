import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Friend {
  friend_id: string;
  display_name?: string;
  avatar_url?: string;
  username?: string;
  status?: string;
  last_seen?: string;
}

interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  created_at: string;
  from_display_name?: string;
  from_avatar_url?: string;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("friends").select("*").eq("user_id", user.id);
    if (data) {
      const friendIds = data.map(d => d.friend_id);
      if (friendIds.length === 0) { setFriends([]); return; }
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url, username").in("user_id", friendIds);
      const { data: presences } = await supabase.from("user_presence").select("user_id, status, last_seen").in("user_id", friendIds);
      
      const merged = data.map(f => {
        const profile = profiles?.find(p => p.user_id === f.friend_id);
        const presence = presences?.find(p => p.user_id === f.friend_id);
        return { friend_id: f.friend_id, display_name: profile?.display_name, avatar_url: profile?.avatar_url, username: profile?.username, status: presence?.status || "offline", last_seen: presence?.last_seen };
      });
      setFriends(merged);
    }
  }, [user]);

  const fetchPendingRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("friend_requests").select("*").eq("to_user_id", user.id).eq("status", "pending");
    if (data) {
      const fromIds = data.map(d => d.from_user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", fromIds);
      const merged = data.map(r => {
        const p = profiles?.find(pr => pr.user_id === r.from_user_id);
        return { ...r, from_display_name: p?.display_name, from_avatar_url: p?.avatar_url };
      });
      setPendingRequests(merged);
    }
  }, [user]);

  const sendRequest = useCallback(async (username: string) => {
    if (!user) return { error: "Not logged in" };
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("username", username).maybeSingle();
    if (!profile) return { error: "User not found" };
    if (profile.user_id === user.id) return { error: "Cannot add yourself" };
    
    const { error } = await supabase.from("friend_requests").insert({ from_user_id: user.id, to_user_id: profile.user_id });
    if (error) return { error: error.message.includes("duplicate") ? "Request already sent" : error.message };
    return { error: null };
  }, [user]);

  const acceptRequest = useCallback(async (requestId: string, fromUserId: string) => {
    if (!user) return;
    await supabase.from("friend_requests").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", requestId);
    // Add both directions
    await supabase.from("friends").insert([
      { user_id: user.id, friend_id: fromUserId },
      { user_id: fromUserId, friend_id: user.id },
    ]);
    fetchFriends();
    fetchPendingRequests();
  }, [user, fetchFriends, fetchPendingRequests]);

  const rejectRequest = useCallback(async (requestId: string) => {
    await supabase.from("friend_requests").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("id", requestId);
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const removeFriend = useCallback(async (friendId: string) => {
    if (!user) return;
    await supabase.from("friends").delete().eq("user_id", user.id).eq("friend_id", friendId);
    await supabase.from("friends").delete().eq("user_id", friendId).eq("friend_id", user.id);
    fetchFriends();
  }, [user, fetchFriends]);

  useEffect(() => { fetchFriends(); fetchPendingRequests(); }, [fetchFriends, fetchPendingRequests]);

  return { friends, pendingRequests, sendRequest, acceptRequest, rejectRequest, removeFriend, fetchFriends };
};
