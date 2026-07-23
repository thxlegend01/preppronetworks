import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShieldCheck, Loader2, Search, EyeOff } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";

const ADMIN_EMAILS = [
  "thxlegend01era@gmail.com",
  "saurabhsaroj2010@gmail.com",
  "manojadeviaw@gmail.com",
  "saurabh20103060@gmail.com",
];

interface DM { id: string; sender_id: string; recipient_id: string; content: string | null; media_url: string | null; media_name: string | null; created_at: string; deleted_for_everyone: boolean; }
interface Profile { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; }

const threadKey = (a: string, b: string) => [a, b].sort().join("|");

const AdminDmMonitorPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const [msgs, setMsgs] = useState<DM[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openThread, setOpenThread] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("direct_messages").select("*").order("created_at", { ascending: true }).limit(2000);
    setMsgs((data as DM[]) || []);
    const ids = new Set<string>();
    (data as DM[] || []).forEach(m => { ids.add(m.sender_id); ids.add(m.recipient_id); });
    if (ids.size) {
      const { data: pr } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").in("user_id", Array.from(ids));
      const map: Record<string, Profile> = {};
      (pr as Profile[] || []).forEach(p => { map[p.user_id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin || !unlocked) return;
    load();
    const ch = supabase.channel("admin-dm").on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin, unlocked, load]);

  const threads = useMemo(() => {
    const map = new Map<string, DM[]>();
    for (const m of msgs) {
      const k = threadKey(m.sender_id, m.recipient_id);
      const arr = map.get(k) || []; arr.push(m); map.set(k, arr);
    }
    return Array.from(map.entries()).map(([k, arr]) => {
      const [a, b] = k.split("|");
      return { key: k, a, b, last: arr[arr.length - 1], msgs: arr, count: arr.length };
    }).sort((x, y) => new Date(y.last.created_at).getTime() - new Date(x.last.created_at).getTime())
      .filter(t => {
        if (!q.trim()) return true;
        const s = q.toLowerCase();
        const pa = profiles[t.a], pb = profiles[t.b];
        return [pa?.display_name, pa?.username, pb?.display_name, pb?.username].some(v => v?.toLowerCase().includes(s));
      });
  }, [msgs, profiles, q]);

  const active = openThread ? threads.find(t => t.key === openThread) : null;

  if (authLoading) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-3">
        <EyeOff className="w-10 h-10 text-muted-foreground" />
        <h1 className="text-xl font-bold">Admins only</h1>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background grid place-items-center px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); if (pwd.trim() === "Saurabh") { setUnlocked(true); setErr(""); } else setErr("Incorrect password"); }}
          className="w-full max-w-sm p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 grid place-items-center mx-auto"><ShieldCheck className="w-7 h-7 text-white" /></div>
          <div className="text-center">
            <h2 className="font-black text-xl">DM Moderation</h2>
            <p className="text-xs text-muted-foreground mt-1">Enter the admin password to open the DM monitor.</p>
          </div>
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" autoFocus className="rounded-xl" />
          {err && <p className="text-xs text-destructive text-center">{err}</p>}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/")} className="flex-1 rounded-full">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-full">Unlock</Button>
          </div>
        </form>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (active) {
    const pa = profiles[active.a], pb = profiles[active.b];
    return (
      <PageTransition>
        <SEO title="DM Monitor — Admin" description="Admin DM monitoring." path="/admin/dm-monitor" />
        <div className="min-h-screen bg-background pb-24">
          <div className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
            <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={() => setOpenThread(null)} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
              <div className="min-w-0 flex-1">
                <h1 className="font-black text-white text-base leading-none truncate">
                  {(pa?.display_name || pa?.username || "User")} ⇄ {(pb?.display_name || pb?.username || "User")}
                </h1>
                <p className="text-[11px] text-white/85 mt-0.5">{active.count} messages · monitoring view</p>
              </div>
            </div>
          </div>
          <div className="container mx-auto max-w-2xl px-3 py-4 space-y-1.5">
            {active.msgs.map(m => {
              const p = profiles[m.sender_id];
              return (
                <div key={m.id} className="rounded-xl bg-card border border-border/60 p-2.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-0.5">
                    <span className="font-bold text-foreground">{p?.display_name || p?.username || m.sender_id.slice(0, 8)}</span>
                    <span>{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  {m.deleted_for_everyone ? (
                    <p className="italic text-xs text-muted-foreground">🚫 deleted for everyone (still visible to admins)</p>
                  ) : (
                    <>
                      {m.content && <p className="text-sm whitespace-pre-wrap">{m.content}</p>}
                      {m.media_url && <a href={m.media_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">📎 {m.media_name || "attachment"}</a>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SEO title="DM Monitor — Admin" description="Admin DM monitoring." path="/admin/dm-monitor" />
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-black text-lg leading-none">DM Monitor</h1>
              <p className="text-[11px] text-white/85 mt-0.5">{threads.length} conversations · admin view</p>
            </div>
          </div>
          <div className="container mx-auto max-w-2xl px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users…" className="pl-9 bg-white/15 border-white/20 text-white placeholder:text-white/60 rounded-full h-9" />
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-2xl px-3 py-3 space-y-1">
          {threads.length === 0 && <p className="text-center text-muted-foreground py-20 text-sm">No DMs yet.</p>}
          {threads.map(t => {
            const pa = profiles[t.a], pb = profiles[t.b];
            return (
              <button key={t.key} onClick={() => setOpenThread(t.key)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted text-left transition">
                <div className="flex -space-x-3 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary grid place-items-center text-white text-xs font-bold ring-2 ring-background overflow-hidden">
                    {pa?.avatar_url ? <img src={pa.avatar_url} alt="" className="w-full h-full object-cover" /> : (pa?.display_name || pa?.username || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-pink-500 grid place-items-center text-white text-xs font-bold ring-2 ring-background overflow-hidden">
                    {pb?.avatar_url ? <img src={pb.avatar_url} alt="" className="w-full h-full object-cover" /> : (pb?.display_name || pb?.username || "?")[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm truncate">{(pa?.display_name || pa?.username || "User")} ⇄ {(pb?.display_name || pb?.username || "User")}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.last.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.last.deleted_for_everyone ? "🚫 deleted" : (t.last.content || "[attachment]")} · {t.count} msgs</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDmMonitorPage;