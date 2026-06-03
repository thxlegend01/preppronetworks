import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, MessageSquare } from "lucide-react";
import ChatSidebar from "@/components/prepchat/ChatSidebar";
import ChatRoom from "@/components/prepchat/ChatRoom";
import prepproLogo from "@/assets/preppro-logo.jpg";

const DEFAULT_ROOMS = [
  { name: "JEE — Physics", description: "Physics doubts & discussion", category: "JEE" },
  { name: "JEE — Chemistry", description: "Chemistry doubts & discussion", category: "JEE" },
  { name: "JEE — Maths", description: "Mathematics doubts & discussion", category: "JEE" },
  { name: "JEE — Doubts", description: "General JEE doubt solving", category: "JEE" },
  { name: "NEET — Biology", description: "Biology doubts & discussion", category: "NEET" },
  { name: "NEET — Physics", description: "Physics for NEET", category: "NEET" },
  { name: "NEET — Chemistry", description: "Chemistry for NEET", category: "NEET" },
  { name: "NEET — Doubts", description: "General NEET doubt solving", category: "NEET" },
  { name: "Boards — Class 11", description: "Class 11 discussion", category: "Boards" },
  { name: "Boards — Class 12", description: "Class 12 discussion", category: "Boards" },
  { name: "Boards — Doubts", description: "Board exam doubts", category: "Boards" },
  { name: "General Chat", description: "Casual discussion", category: "Community" },
  { name: "Study Motivation", description: "Stay motivated together", category: "Community" },
  { name: "Daily Targets", description: "Share your daily goals", category: "Community" },
  { name: "Doubt Help", description: "Quick doubt solving", category: "Community" },
];

export interface ChatRoomData {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  is_global: boolean;
  created_at: string;
  category?: string;
}

const PrepChatPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [rooms, setRooms] = useState<ChatRoomData[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      const mapped = data.map((r) => {
        const def = DEFAULT_ROOMS.find((d) => d.name === r.name);
        return { ...r, category: def?.category || "Custom" } as ChatRoomData;
      });
      setRooms(mapped);
    }
    setLoading(false);
  }, []);

  const ensureDefaultRooms = useCallback(async () => {
    if (!user) return;
    const { data: existing } = await supabase.from("study_rooms").select("name");
    const existingNames = new Set(existing?.map((r) => r.name) || []);
    const missing = DEFAULT_ROOMS.filter((r) => !existingNames.has(r.name));

    if (missing.length > 0) {
      await supabase.from("study_rooms").insert(
        missing.map((r) => ({
          name: r.name,
          description: r.description,
          created_by: user.id,
          is_global: true,
          max_participants: 500,
        }))
      );
    }
    await fetchRooms();
  }, [user, fetchRooms]);

  useEffect(() => {
    if (user) ensureDefaultRooms();
    else setLoading(false);
  }, [user, ensureDefaultRooms]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || null;

  if (authLoading || loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">PrepChat — PrepPro Network</h1>
        <p className="text-muted-foreground max-w-md">
          Join study chat rooms, discuss doubts, and crack exams together. Login to get started!
        </p>
        <Button onClick={() => navigate("/auth")} className="gap-2">
          <LogIn className="w-4 h-4" /> Login to Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border bg-gradient-to-r from-sky-500/10 via-card to-blue-500/10 flex items-center px-4 shrink-0">
        <div className="relative shrink-0 mr-3">
          <div className="absolute -inset-1 bg-gradient-to-br from-sky-500 to-blue-600 opacity-40 blur-md rounded-xl" />
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-sky-500/40 shadow-md">
            <img src={prepproLogo} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="font-black text-foreground text-lg leading-none tracking-tight">PrepChat</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">by PrepPro Network</p>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="font-semibold">
            Home
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - show on desktop or when no room selected on mobile */}
        {(!isMobile || !selectedRoomId) && (
          <ChatSidebar
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            userId={user.id}
          />
        )}

        {/* Chat area */}
        {(!isMobile || selectedRoomId) && (
          <div className="flex-1 flex flex-col min-w-0">
            {selectedRoom ? (
              <ChatRoom
                room={selectedRoom}
                userId={user.id}
                onBack={() => setSelectedRoomId(null)}
                isMobile={isMobile}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <MessageSquare className="w-12 h-12 text-primary/30" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to PrepChat 🚀</h2>
                <p className="text-muted-foreground max-w-sm">
                  Discuss doubts, help others, and crack JEE/NEET together. Select a chat room to begin!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrepChatPage;
