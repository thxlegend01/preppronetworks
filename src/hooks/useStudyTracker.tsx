import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type TimerMode = "normal" | "pomodoro_25_5" | "pomodoro_50_10";

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface StudySession {
  id: string;
  subject_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  mode: TimerMode;
  notes: string | null;
  rating: number | null;
  is_active: boolean;
  last_tick_at: string;
}

interface StudyStats {
  todaySeconds: number;
  yesterdaySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  sessionsCount: number;
  subjectBreakdown: { name: string; seconds: number; color: string }[];
  dailyData: { date: string; seconds: number }[];
  hourlyData: number[];
}

interface Goals {
  daily_goal_minutes: number;
  weekly_goal_minutes: number;
  streak_minimum_minutes: number;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
}

export const useStudyTracker = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mode, setMode] = useState<TimerMode>("normal");
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "break">("work");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<StudyStats>({
    todaySeconds: 0, yesterdaySeconds: 0, weekSeconds: 0, monthSeconds: 0,
    sessionsCount: 0, subjectBreakdown: [], dailyData: [], hourlyData: Array(24).fill(0),
  });
  const [goals, setGoals] = useState<Goals>({ daily_goal_minutes: 120, weekly_goal_minutes: 600, streak_minimum_minutes: 30 });
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, longest_streak: 0, last_study_date: null });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [quote, setQuote] = useState({ quote: "", author: "" });
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("subjects").select("*").eq("user_id", user.id).order("name");
    if (data) setSubjects(data);
  }, [user]);

  // Fetch sessions & stats
  const fetchStats = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(startOfDay); yesterday.setDate(yesterday.getDate() - 1);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", false)
      .gte("started_at", thirtyDaysAgo.toISOString())
      .order("started_at", { ascending: false });

    if (!data) return;
    setSessions(data as StudySession[]);

    const todaySeconds = data.filter(s => new Date(s.started_at) >= startOfDay).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const yesterdaySeconds = data.filter(s => { const d = new Date(s.started_at); return d >= yesterday && d < startOfDay; }).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const weekSeconds = data.filter(s => new Date(s.started_at) >= startOfWeek).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const monthSeconds = data.filter(s => new Date(s.started_at) >= startOfMonth).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

    // Subject breakdown
    const subjectMap = new Map<string, { seconds: number; name: string; color: string }>();
    for (const s of data) {
      const subj = subjects.find(sb => sb.id === s.subject_id);
      const key = s.subject_id || "unknown";
      const existing = subjectMap.get(key) || { seconds: 0, name: subj?.name || "Other", color: subj?.color || "#6366f1" };
      existing.seconds += s.duration_seconds || 0;
      subjectMap.set(key, existing);
    }

    // Daily data (last 7 days)
    const dailyData: { date: string; seconds: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
      const daySeconds = data.filter(s => { const sd = new Date(s.started_at); return sd >= dayStart && sd < dayEnd; }).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
      dailyData.push({ date: dayStart.toLocaleDateString("en", { weekday: "short" }), seconds: daySeconds });
    }

    // Hourly heatmap
    const hourlyData = Array(24).fill(0);
    data.forEach(s => { const h = new Date(s.started_at).getHours(); hourlyData[h] += s.duration_seconds || 0; });

    setStats({ todaySeconds, yesterdaySeconds, weekSeconds, monthSeconds, sessionsCount: data.length, subjectBreakdown: Array.from(subjectMap.values()), dailyData, hourlyData });
  }, [user, subjects]);

  // Fetch goals
  const fetchGoals = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("user_goals").select("*").eq("user_id", user.id).maybeSingle();
    if (data) setGoals(data);
  }, [user]);

  // Fetch streak
  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle();
    if (data) setStreak(data);
  }, [user]);

  // Fetch quote
  const fetchQuote = useCallback(async () => {
    const { data } = await supabase.from("motivational_quotes").select("*");
    if (data && data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setQuote({ quote: random.quote, author: random.author || "Unknown" });
    }
  }, []);

  // Check for active session on load
  const checkActiveSession = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("study_sessions").select("*").eq("user_id", user.id).eq("is_active", true).maybeSingle();
    if (data) {
      const session = data as StudySession;
      setSessionId(session.id);
      setIsActive(true);
      setMode(session.mode);
      setSelectedSubject(session.subject_id);
      // Calculate elapsed time from server
      const started = new Date(session.started_at).getTime();
      const lastTick = new Date(session.last_tick_at).getTime();
      const serverElapsed = Math.floor((lastTick - started) / 1000);
      const timeSinceLastTick = Math.floor((Date.now() - lastTick) / 1000);
      setElapsedSeconds(serverElapsed + timeSinceLastTick);
      startTimeRef.current = Date.now() - (serverElapsed + timeSinceLastTick) * 1000;
    }
  }, [user]);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);
  useEffect(() => { if (subjects.length >= 0) fetchStats(); }, [fetchStats, subjects]);
  useEffect(() => { fetchGoals(); fetchStreak(); fetchQuote(); checkActiveSession(); }, [fetchGoals, fetchStreak, fetchQuote, checkActiveSession]);

  // Timer interval
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, isPaused]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (isActive && !isPaused && sessionId) {
      saveIntervalRef.current = setInterval(async () => {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        await supabase.from("study_sessions").update({
          duration_seconds: currentElapsed,
          last_tick_at: new Date().toISOString(),
        }).eq("id", sessionId);
      }, 5000);
    }
    return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current); };
  }, [isActive, isPaused, sessionId]);

  // Pomodoro phase tracking
  useEffect(() => {
    if (!isActive || mode === "normal") return;
    const workMinutes = mode === "pomodoro_25_5" ? 25 : 50;
    const breakMinutes = mode === "pomodoro_25_5" ? 5 : 10;
    const cycleSeconds = (workMinutes + breakMinutes) * 60;
    const inCycle = elapsedSeconds % cycleSeconds;
    if (inCycle < workMinutes * 60) {
      setPomodoroPhase("work");
    } else {
      setPomodoroPhase("break");
    }
    setPomodoroCount(Math.floor(elapsedSeconds / cycleSeconds));
  }, [elapsedSeconds, mode, isActive]);

  // Update presence
  const updatePresence = useCallback(async (status: string) => {
    if (!user) return;
    await supabase.from("user_presence").upsert({ user_id: user.id, status: status as any, last_seen: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  }, [user]);

  const startSession = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("study_sessions").insert({
      user_id: user.id,
      subject_id: selectedSubject,
      mode,
      started_at: new Date().toISOString(),
      is_active: true,
      duration_seconds: 0,
    }).select().single();
    if (error || !data) return;
    setSessionId(data.id);
    setIsActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    await updatePresence("studying");
  }, [user, selectedSubject, mode, updatePresence]);

  const pauseSession = useCallback(() => {
    setIsPaused(true);
    pausedAtRef.current = Date.now();
    updatePresence("break");
  }, [updatePresence]);

  const resumeSession = useCallback(() => {
    const pauseDuration = Date.now() - pausedAtRef.current;
    startTimeRef.current += pauseDuration;
    setIsPaused(false);
    updatePresence("studying");
  }, [updatePresence]);

  const stopSession = useCallback(async () => {
    if (!sessionId) return;
    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    await supabase.from("study_sessions").update({
      ended_at: new Date().toISOString(),
      duration_seconds: finalElapsed,
      is_active: false,
      last_tick_at: new Date().toISOString(),
    }).eq("id", sessionId);
    
    setElapsedSeconds(finalElapsed);
    setIsActive(false);
    setIsPaused(false);
    setShowSessionModal(true);
    await updatePresence("online");
    
    // Update streak
    await updateStreak();
    fetchStats();
    fetchQuote();
  }, [sessionId, updatePresence, fetchStats, fetchQuote]);

  const updateStreak = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle();
    
    if (existing) {
      const lastDate = existing.last_study_date;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      let newStreak = existing.current_streak;
      if (lastDate === today) {
        // Already studied today
      } else if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      const longest = Math.max(newStreak, existing.longest_streak);
      await supabase.from("user_streaks").update({ current_streak: newStreak, longest_streak: longest, last_study_date: today, updated_at: new Date().toISOString() }).eq("user_id", user.id);
      setStreak({ current_streak: newStreak, longest_streak: longest, last_study_date: today });
    } else {
      await supabase.from("user_streaks").insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_study_date: today });
      setStreak({ current_streak: 1, longest_streak: 1, last_study_date: today });
    }
  }, [user]);

  const saveSessionDetails = useCallback(async (notes: string, rating: number, subjectId: string | null) => {
    if (!sessionId) return;
    await supabase.from("study_sessions").update({ notes, rating, subject_id: subjectId }).eq("id", sessionId);
    setShowSessionModal(false);
    setSessionId(null);
    fetchStats();
  }, [sessionId, fetchStats]);

  const addSubject = useCallback(async (name: string, color: string) => {
    if (!user) return;
    await supabase.from("subjects").insert({ user_id: user.id, name, color });
    fetchSubjects();
  }, [user, fetchSubjects]);

  const deleteSubject = useCallback(async (id: string) => {
    await supabase.from("subjects").delete().eq("id", id);
    fetchSubjects();
  }, [fetchSubjects]);

  const updateGoals = useCallback(async (newGoals: Partial<Goals>) => {
    if (!user) return;
    await supabase.from("user_goals").upsert({ user_id: user.id, ...goals, ...newGoals, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setGoals(prev => ({ ...prev, ...newGoals }));
  }, [user, goals]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatMinutes = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return {
    isActive, isPaused, elapsedSeconds, mode, pomodoroPhase, pomodoroCount,
    selectedSubject, subjects, sessions, stats, goals, streak, quote,
    showSessionModal, setShowSessionModal,
    setMode, setSelectedSubject,
    startSession, pauseSession, resumeSession, stopSession,
    saveSessionDetails, addSubject, deleteSubject, updateGoals,
    formatTime, formatMinutes, fetchStats,
  };
};
