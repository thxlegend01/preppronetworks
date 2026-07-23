import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MessageSquare, Loader2, Search, ShieldAlert, LogIn } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";

interface DM {
  id: string; sender_id: string; recipient_id: string; content: string | null;
  media_name: string | null; created_at: string; deleted_for: string[] | null; deleted_for_everyone: boolean;
}
interface Profile { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; }

const DmInboxPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<DM[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: m }, { data: h }] = await Promise.all([
      supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, content, media_name, created_at, deleted_for, deleted_for_everyone")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("dm_hidden_threads").select("partner_id").eq("user_id", user.id),
    ]);
    setMsgs((m as DM[]) || []);
    setHidden(new Set(((h as any[]) || []).map(x => x.partner_id)));
    const ids = new Set<string>();
    (m as DM[] || []).forEach(x => { ids.add(x.sender_id === user.id ? x.recipient_id : x.sender_id); });
    if (ids.size) {
      const { data: pr } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").in("user_id", Array.from(ids));
      const map: Record<string, Profile> = {};
      (pr as Profile[] || []).forEach(p => { map[p.user_id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    load();
    const ch = supabase.channel("dm-inbox").on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  const threads = useMemo(() => {
    if (!user) return [];
    const map = new Map<string, DM>();
    for (const m of msgs) {
      const partner = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      if (hidden.has(partner)) continue;
      if ((m.deleted_for || []).includes(user.id)) continue;
      if (!map.has(partner)) map.set(partner, m);
    }
    return Array.from(map.entries()).map(([partnerId, last]) => ({
      partnerId, last, profile: profiles[partnerId],
    })).filter(t => {
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return t.profile?.display_name?.toLowerCase().includes(s) || t.profile?.username?.toLowerCase().includes(s);
    });
  }, [msgs, hidden, profiles, user, q]);

  if (authLoading || loading) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 grid place-items-center"><MessageSquare className="w-10 h-10 text-primary" /></div>
        <h1 className="text-2xl font-bold">Direct Messages</h1>
        <p className="text-muted-foreground max-w-md text-sm">Login to see your private conversations.</p>
        <Button onClick={() => navigate("/auth")} className="gap-2"><LogIn className="w-4 h-4" /> Login</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO title="Direct Messages — PrepPro Network" description="Your private 1-on-1 chats on PrepPro Network." path="/dm" />
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-30 bg-gradient-to-r from-primary/90 via-pink-500 to-fuchsia-600 shadow-lg">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-black text-lg leading-none">Direct Messages</h1>
              <p className="text-[11px] text-white/85 mt-0.5">{threads.length} conversations</p>
            </div>
          </div>
          <div className="container mx-auto max-w-2xl px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search conversations…" className="pl-9 bg-white/15 border-white/20 text-white placeholder:text-white/60 rounded-full h-9" />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-2xl px-3 py-3">
          <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Chats may be reviewed by admins for safety.</span>
          </div>

          {threads.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No conversations yet.</p>
              <p className="text-xs mt-1">Open a user's profile from Community or PrepChat to start one.</p>
            </div>
          )}

          <div className="space-y-1">
            {threads.map(t => (
              <button key={t.partnerId} onClick={() => navigate(`/dm/${t.partnerId}`)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted text-left transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold shrink-0 overflow-hidden">
                  {t.profile?.avatar_url ? <img src={t.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : (t.profile?.display_name || t.profile?.username || "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm truncate">{t.profile?.display_name || t.profile?.username || "User"}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.last.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.last.sender_id === user.id ? "You: " : ""}
                    {t.last.deleted_for_everyone ? "🚫 message deleted" : (t.last.content || (t.last.media_name ? `📎 ${t.last.media_name}` : "[attachment]"))}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DmInboxPage;