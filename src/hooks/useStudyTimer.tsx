import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface StudyStats {
  totalMinutes: number;
  todayMinutes: number;
  weekMinutes: number;
  sessionsCount: number;
}

export const useStudyTimer = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [stats, setStats] = useState<StudyStats>({
    totalMinutes: 0,
    todayMinutes: 0,
    weekMinutes: 0,
    sessionsCount: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("user_study_sessions")
      .select("duration_minutes, started_at")
      .eq("user_id", user.id)
      .not("duration_minutes", "is", null);

    if (error) {
      console.error("Error fetching stats:", error);
      return;
    }

    const totalMinutes = data.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const todayMinutes = data
      .filter(s => new Date(s.started_at) >= startOfDay)
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const weekMinutes = data
      .filter(s => new Date(s.started_at) >= startOfWeek)
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    setStats({
      totalMinutes,
      todayMinutes,
      weekMinutes,
      sessionsCount: data.length,
    });
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Timer interval
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const startSession = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_study_sessions")
      .insert({
        user_id: user.id,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting session:", error);
      return;
    }

    setSessionId(data.id);
    setIsActive(true);
    setElapsedSeconds(0);
  }, [user]);

  const stopSession = useCallback(async () => {
    if (!user || !sessionId) return;

    const durationMinutes = Math.ceil(elapsedSeconds / 60);

    const { error } = await supabase
      .from("user_study_sessions")
      .update({
        ended_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error stopping session:", error);
      return;
    }

    setIsActive(false);
    setSessionId(null);
    fetchStats();
  }, [user, sessionId, elapsedSeconds, fetchStats]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return {
    isActive,
    elapsedSeconds,
    stats,
    startSession,
    stopSession,
    formatTime,
    formatMinutes,
  };
};