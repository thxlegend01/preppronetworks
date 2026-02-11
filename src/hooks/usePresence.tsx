import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PresenceUser {
  user_id: string;
  status: string;
  last_seen: string;
  display_name?: string;
  avatar_url?: string;
  username?: string;
}

export const usePresence = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [liveStats, setLiveStats] = useState({ online: 0, studying: 0, totalTodayHours: 0 });

  const fetchPresence = useCallback(async () => {
    const { data } = await supabase
      .from("user_presence")
      .select("*")
      .in("status", ["online", "studying", "break"]);
    
    if (data) {
      // Fetch profile info for each user
      const userIds = data.map(d => d.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url, username").in("user_id", userIds);
      
      const merged = data.map(p => {
        const profile = profiles?.find(pr => pr.user_id === p.user_id);
        return { ...p, display_name: profile?.display_name, avatar_url: profile?.avatar_url, username: profile?.username };
      });
      
      setOnlineUsers(merged);
      setLiveStats({
        online: data.filter(d => d.status !== "offline").length,
        studying: data.filter(d => d.status === "studying").length,
        totalTodayHours: 0,
      });
    }
  }, []);

  // Set user online when hook mounts
  useEffect(() => {
    if (!user) return;
    
    const setOnline = async () => {
      await supabase.from("user_presence").upsert(
        { user_id: user.id, status: "online", last_seen: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    };
    setOnline();

    // Set offline on unmount
    return () => {
      supabase.from("user_presence").upsert(
        { user_id: user.id, status: "offline", last_seen: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    };
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    fetchPresence();
    const channel = supabase.channel("presence-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_presence" }, () => {
        fetchPresence();
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [fetchPresence]);

  return { onlineUsers, liveStats, fetchPresence };
};
