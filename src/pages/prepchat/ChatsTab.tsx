import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquare, Plus, Radio, Users, Search, Trash2, Lock, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ProfileLite, fetchProfiles, initialsOf, nameOf, timeAgo } from "@/lib/prepchat";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  type: "dm" | "group" | "channel";
  title: string | null;
  avatar_url: string | null;
  last_message_at: string;
  lastRead: string;
  partner?: ProfileLite;
  preview?: string;
  unread: number;
}

const ChatsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: memberships } = await supabase
      .from("chat_members")
      .select("conversation_id, last_read_at, cleared_at, chat_conversations!inner(id, type, title, avatar_url, last_message_at)")
      .eq("user_id", user.id);

    const list = (memberships || []) as unknown as {
      conversation_id: string;
      last_read_at: string;
      cleared_at: string | null;
      chat_conversations: { id: string; type: Row["type"]; title: string | null; avatar_url: string | null; last_message_at: string };
    }[];
    if (!list.length) { setRows([]); setLoading(false); return; }

    const convIds = list.map((m) => m.conversation_id);

    const [{ data: others }, { data: msgs }] = await Promise.all([
      supabase.from("chat_members").select("conversation_id, user_id").in("conversation_id", convIds).neq("user_id", user.id),
      supabase.from("chat_messages").select("conversation_id, content, media_name, created_at, deleted_for_everyone").in("conversation_id", convIds).order("created_at", { ascending: false }).limit(600),
    ]);

    const partnerMap: Record<string, string> = {};
    (others || []).forEach((o) => { if (!partnerMap[o.conversation_id]) partnerMap[o.conversation_id] = o.user_id; });
    const profiles = await fetchProfiles(Object.values(partnerMap));

    const built: Row[] = list.map((m) => {
      const c = m.chat_conversations;
      const convMsgs = (msgs || [])
        .filter((x) => x.conversation_id === c.id)
        .filter((x) => !m.cleared_at || new Date(x.created_at) > new Date(m.cleared_at));
      const last = convMsgs[0];
      const unread = convMsgs.filter((x) => new Date(x.created_at) > new Date(m.last_read_at)).length;
      return {
        id: c.id,
        type: c.type,
        title: c.title,
        avatar_url: c.avatar_url,
        last_message_at: last?.created_at || c.last_message_at,
        lastRead: m.last_read_at,
        partner: c.type === "dm" ? profiles[partnerMap[c.id]] : undefined,
        preview: last ? (last.deleted_for_everyone ? "🚫 message deleted" : last.content || (last.media_name ? `📎 ${last.media_name}` : "attachment")) : "No messages yet",
        unread,
      };
    }).sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));

    setRows(built);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("prepchat-inbox")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_members" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const clearChat = async (convId: string) => {
    if (!user) return;
    await supabase.from("chat_members").update({ cleared_at: new Date().toISOString() })
      .eq("conversation_id", convId).eq("user_id", user.id);
    toast.success("Chat cleared on your side");
    load();
  };

  const deleteChat = async (convId: string) => {
    if (!user) return;
    const { error } = await supabase.from("chat_members").delete()
      .eq("conversation_id", convId).eq("user_id", user.id);
    if (error) return toast.error("Could not delete chat");
    setRows((prev) => prev.filter((r) => r.id !== convId));
    toast.success("Chat deleted from your side");
  };

  const filtered = rows.filter((r) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (r.title || "").toLowerCase().includes(s) || nameOf(r.partner).toLowerCase().includes(s);
  });

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats…" className="pl-9 h-10 rounded-full" />
        </div>
        <Button size="icon" className="rounded-full h-10 w-10 shrink-0" onClick={() => navigate("/prepchat/chats/new")}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>Your chats are private — no admin monitoring.</span>
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !filtered.length ? (
        <div className="py-16 text-center text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="font-semibold text-foreground">No chats yet</p>
          <p className="text-sm mt-1">Tap + to start a DM, group or channel.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((r) => (
            <div key={r.id} className="w-full flex items-center gap-1 rounded-2xl hover:bg-muted transition">
            <button
              onClick={() => navigate(`/prepchat/chats/${r.id}`)}
              className="flex-1 min-w-0 flex items-center gap-3 p-2.5 text-left"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold shrink-0">
                {r.type === "dm"
                  ? (r.partner?.avatar_url ? <img src={r.partner.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(r.partner))
                  : r.avatar_url ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                  : r.type === "channel" ? <Radio className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm truncate">{r.type === "dm" ? nameOf(r.partner) : r.title || "Untitled"}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(r.last_message_at)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-xs truncate", r.unread ? "text-foreground font-semibold" : "text-muted-foreground")}>{r.preview}</p>
                  {r.unread > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black grid place-items-center shrink-0">
                      {r.unread > 99 ? "99+" : r.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 mr-1 rounded-full text-muted-foreground hover:bg-background shrink-0">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => clearChat(r.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear messages (my side)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => deleteChat(r.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete whole chat (my side)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatsTab;