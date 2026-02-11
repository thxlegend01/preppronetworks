import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_seconds: number;
  rank: number;
}

type Period = "daily" | "weekly";

export const useLeaderboard = (period: Period = "daily") => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    let startDate: Date;
    if (period === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    }

    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("user_id, duration_seconds")
      .eq("is_active", false)
      .gte("started_at", startDate.toISOString());

    if (!sessions) { setLoading(false); return; }

    // Aggregate by user
    const userMap = new Map<string, number>();
    sessions.forEach(s => {
      userMap.set(s.user_id, (userMap.get(s.user_id) || 0) + (s.duration_seconds || 0));
    });

    const userIds = Array.from(userMap.keys());
    if (userIds.length === 0) { setEntries([]); setLoading(false); return; }

    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", userIds);

    const sorted = Array.from(userMap.entries())
      .map(([userId, totalSeconds]) => {
        const profile = profiles?.find(p => p.user_id === userId);
        return { user_id: userId, display_name: profile?.display_name || "Anonymous", avatar_url: profile?.avatar_url || null, total_seconds: totalSeconds, rank: 0 };
      })
      .sort((a, b) => b.total_seconds - a.total_seconds)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));

    setEntries(sorted.slice(0, 50));
    setLoading(false);
  }, [period]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase.channel("leaderboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "study_sessions" }, () => {
        fetchLeaderboard();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeaderboard]);

  return { entries, loading, fetchLeaderboard };
};
