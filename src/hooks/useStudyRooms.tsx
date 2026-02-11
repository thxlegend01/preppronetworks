import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Room {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  is_global: boolean;
  max_participants: number;
  created_at: string;
  participant_count?: number;
}

interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  display_name?: string;
  avatar_url?: string;
  status?: string;
}

export const useStudyRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchRooms = useCallback(async () => {
    const { data } = await supabase.from("study_rooms").select("*").order("created_at", { ascending: false });
    if (data) {
      // Get participant counts
      const roomsWithCounts = await Promise.all(data.map(async (room) => {
        const { count } = await supabase.from("room_participants").select("*", { count: "exact", head: true }).eq("room_id", room.id);
        return { ...room, participant_count: count || 0 };
      }));
      setRooms(roomsWithCounts);
    }
  }, []);

  const fetchParticipants = useCallback(async (roomId: string) => {
    const { data } = await supabase.from("room_participants").select("*").eq("room_id", roomId);
    if (data) {
      const userIds = data.map(d => d.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", userIds);
      const { data: presences } = await supabase.from("user_presence").select("user_id, status").in("user_id", userIds);
      
      const merged = data.map(p => {
        const profile = profiles?.find(pr => pr.user_id === p.user_id);
        const presence = presences?.find(pr => pr.user_id === p.user_id);
        return { ...p, display_name: profile?.display_name, avatar_url: profile?.avatar_url, status: presence?.status || "offline" };
      }).sort((a, b) => {
        const order = { studying: 0, break: 1, online: 2, offline: 3 };
        return (order[a.status as keyof typeof order] || 3) - (order[b.status as keyof typeof order] || 3);
      });
      setParticipants(merged);
    }
  }, []);

  const createRoom = useCallback(async (name: string, description: string) => {
    if (!user) return;
    const { data } = await supabase.from("study_rooms").insert({ name, description, created_by: user.id }).select().single();
    if (data) { fetchRooms(); return data; }
    return null;
  }, [user, fetchRooms]);

  const joinRoom = useCallback(async (roomId: string) => {
    if (!user) return;
    await supabase.from("room_participants").upsert({ room_id: roomId, user_id: user.id }, { onConflict: "room_id,user_id" });
    const room = rooms.find(r => r.id === roomId);
    if (room) setCurrentRoom(room);
    fetchParticipants(roomId);
    fetchRooms();
  }, [user, rooms, fetchParticipants, fetchRooms]);

  const leaveRoom = useCallback(async (roomId: string) => {
    if (!user) return;
    await supabase.from("room_participants").delete().eq("room_id", roomId).eq("user_id", user.id);
    setCurrentRoom(null);
    setParticipants([]);
    fetchRooms();
  }, [user, fetchRooms]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // Realtime for room participants
  useEffect(() => {
    if (!currentRoom) return;
    const channel = supabase.channel(`room-${currentRoom.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${currentRoom.id}` }, () => {
        fetchParticipants(currentRoom.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentRoom, fetchParticipants]);

  return { rooms, currentRoom, participants, createRoom, joinRoom, leaveRoom, fetchRooms, setCurrentRoom };
};
