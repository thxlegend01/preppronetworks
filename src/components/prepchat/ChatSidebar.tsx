import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoomData } from "@/pages/PrepChatPage";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Hash, Users, Sparkles, BookOpen, GraduationCap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  rooms: ChatRoomData[];
  selectedRoomId: string | null;
  onSelectRoom: (id: string) => void;
  userId: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  JEE: <Sparkles className="w-4 h-4 text-accent" />,
  NEET: <BookOpen className="w-4 h-4 text-primary" />,
  Boards: <GraduationCap className="w-4 h-4 text-primary" />,
  Community: <MessageCircle className="w-4 h-4 text-primary" />,
  Custom: <Hash className="w-4 h-4 text-muted-foreground" />,
};

const ChatSidebar = ({ rooms, selectedRoomId, onSelectRoom, userId }: Props) => {
  const [search, setSearch] = useState("");
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; username: string | null }>({ display_name: null, avatar_url: null, username: null });

  useEffect(() => {
    supabase.from("profiles").select("display_name, avatar_url, username").eq("user_id", userId).maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });

    // Fetch participant counts
    supabase.from("room_participants").select("room_id").then(({ data }) => {
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((p) => { counts[p.room_id] = (counts[p.room_id] || 0) + 1; });
        setOnlineCounts(counts);
      }
    });
  }, [userId]);

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, ChatRoomData[]>>((acc, room) => {
    const cat = room.category || "Custom";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(room);
    return acc;
  }, {});

  const categoryOrder = ["JEE", "NEET", "Boards", "Community", "Custom"];

  return (
    <div className="w-full md:w-80 border-r border-border bg-card flex flex-col shrink-0">
      {/* User profile area */}
      <div className="p-3 border-b border-border flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {(profile.display_name || profile.username || "U")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{profile.display_name || profile.username || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">@{profile.username || "user"}</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary/50 border-0"
          />
        </div>
      </div>

      {/* Room list */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {categoryOrder.map((cat) => {
            const catRooms = grouped[cat];
            if (!catRooms?.length) return null;
            return (
              <div key={cat} className="mb-4">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                  {CATEGORY_ICONS[cat]}
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat}</span>
                </div>
                {catRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                      selectedRoomId === room.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary/80 text-foreground"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Hash className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{room.name.replace(/^(JEE|NEET|Boards) — /, "")}</p>
                      <p className="text-xs text-muted-foreground truncate">{room.description}</p>
                    </div>
                    {onlineCounts[room.id] ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{onlineCounts[room.id]}</span>
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
