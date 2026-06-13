import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ArrowLeft, Send, Loader2, LogIn, Shield, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import prepproLogo from "@/assets/preppro-logo.jpg";

const ADMIN_EMAILS = [
  "thxlegend01era@gmail.com",
  "saurabhsaroj2010@gmail.com",
  "manojadeviaw@gmail.com",
  "saurabh20103060@gmail.com",
];

interface Msg {
  id: string;
  user_id: string;
  sender_id: string;
  content: string;
  from_owner: boolean;
  created_at: string;
}
interface Profile { user_id: string; display_name: string | null; username: string | null; avatar_url: string | null; }

const OwnerChatPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("owner_messages").select("*").order("created_at", { ascending: true });
    setMsgs((data || []) as Msg[]);
    if (isAdmin) {
      const ids = Array.from(new Set((data || []).map((m: any) => m.user_id)));
      if (ids.length) {
        const { data: pr } = await supabase.from("profiles").select("user_id, display_name, username, avatar_url").in("user_id", ids);
        const map: Record<string, Profile> = {};
        (pr || []).forEach((x: any) => { map[x.user_id] = x; });
        setProfiles(map);
      }
    }
    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchData();
    const ch = supabase.channel("owner-msgs").on("postgres_changes", { event: "*", schema: "public", table: "owner_messages" }, fetchData).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, fetchData]);

  // For non-admin, the thread IS theirs
  const myThread = useMemo(() => {
    if (!user) return [];
    return msgs.filter(m => m.user_id === user.id);
  }, [msgs, user]);

  // For admin: group by user_id
  const threads = useMemo(() => {
    const map = new Map<string, Msg[]>();
    msgs.forEach(m => {
      const arr = map.get(m.user_id) || [];
      arr.push(m);
      map.set(m.user_id, arr);
    });
    const list = Array.from(map.entries()).map(([uid, arr]) => ({
      userId: uid,
      profile: profiles[uid],
      last: arr[arr.length - 1],
      messages: arr,
      unread: arr.filter(m => !m.from_owner).length,
    }));
    list.sort((a, b) => new Date(b.last.created_at).getTime() - new Date(a.last.created_at).getTime());
    return list;
  }, [msgs, profiles]);

  const activeMsgs = isAdmin ? (threads.find(t => t.userId === activeThread)?.messages || []) : myThread;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeMsgs.length]);

  const send = async () => {
    if (!user || !draft.trim()) return;
    const targetUserId = isAdmin ? activeThread : user.id;
    if (!targetUserId) return;
    setSending(true);
    const { error } = await supabase.from("owner_messages").insert({
      user_id: targetUserId,
      sender_id: user.id,
      content: draft.trim(),
      from_owner: isAdmin,
    });
    setSending(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setDraft("");
  };

  const deleteMsg = async (id: string) => {
    if (!isAdmin) return;
    await supabase.from("owner_messages").delete().eq("id", id);
  };

  if (authLoading || loading) {
    return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><Shield className="w-10 h-10 text-primary" /></div>
        <h1 className="text-2xl font-bold">Message the Owner</h1>
        <p className="text-muted-foreground max-w-md">Login to start a private chat with the owner.</p>
        <Button onClick={() => navigate("/auth")} className="gap-2"><LogIn className="w-4 h-4" /> Login</Button>
      </div>
    );
  }

  // Admin INBOX list view
  if (isAdmin && !activeThread) {
    const filtered = threads.filter(t => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.profile?.display_name?.toLowerCase().includes(q) || t.profile?.username?.toLowerCase().includes(q) || t.userId.includes(q);
    });
    return (
      <PageTransition>
        <SEO title="Owner Inbox — PrepPro Network" description="Private 1-on-1 chats with PrepPro Network users." path="/owner-chat" />
        <div className="min-h-screen bg-background pb-24">
          <div className="sticky top-0 z-30 bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#22d3ee] shadow-lg">
            <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
              <div className="flex-1 min-w-0">
                <h1 className="font-black text-white text-lg leading-none">Owner Inbox</h1>
                <p className="text-[11px] text-white/85 mt-0.5">{threads.length} conversations</p>
              </div>
            </div>
            <div className="container mx-auto max-w-2xl px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="pl-9 bg-white/15 border-white/20 text-white placeholder:text-white/60 rounded-full h-9" />
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-2xl px-2 py-3 space-y-1">
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-20 text-sm">No conversations yet.</p>}
            {filtered.map(t => (
              <button
                key={t.userId}
                onClick={() => setActiveThread(t.userId)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted text-left transition"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 grid place-items-center text-white font-bold shrink-0">
                  {t.profile?.avatar_url ? <img src={t.profile.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : (t.profile?.display_name || t.profile?.username || "U")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-foreground truncate">{t.profile?.display_name || t.profile?.username || "User"}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.last.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.last.from_owner ? "You: " : ""}{t.last.content}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  // Conversation view (user OR admin opened thread)
  const partnerProfile = isAdmin ? profiles[activeThread!] : null;
  const headerTitle = isAdmin ? (partnerProfile?.display_name || partnerProfile?.username || "User") : "Owner";
  const headerSub = isAdmin ? "Private 1-on-1" : "Direct line — replies as soon as possible";

  return (
    <PageTransition>
      <SEO title={isAdmin ? "Chat — Owner Inbox" : "Message the Owner — PrepPro Network"} description="Private 1-on-1 chat with the PrepPro owner." path="/owner-chat" />
      <div className="h-screen bg-background flex flex-col">
        <div className="bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#22d3ee] shadow-lg shrink-0">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => isAdmin ? setActiveThread(null) : navigate("/")} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/70 bg-white shrink-0">
              <img src={prepproLogo} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-black text-white text-base leading-none truncate">{headerTitle}</h1>
              <p className="text-[11px] text-white/85 mt-0.5">{headerSub}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(2,132,199,0.06),transparent_60%)]">
          <div className="container mx-auto max-w-2xl px-3 py-4 flex flex-col gap-2">
            {activeMsgs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 mx-auto grid place-items-center mb-3"><Shield className="w-8 h-8 text-sky-500" /></div>
                <p className="text-sm font-bold text-foreground">Start a private conversation</p>
                <p className="text-xs text-muted-foreground mt-1">Only you and the owner can read these messages.</p>
              </div>
            )}
            {activeMsgs.map(m => {
              const mine = isAdmin ? m.from_owner : !m.from_owner;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"} group`}>
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${mine ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-md" : "bg-card border border-border/60 text-foreground rounded-bl-md"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${mine ? "text-white/75" : "text-muted-foreground"}`}>
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {isAdmin && (
                        <button onClick={() => deleteMsg(m.id)} className="opacity-0 group-hover:opacity-100 transition hover:text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-border/60 bg-card shrink-0">
          <div className="container mx-auto max-w-2xl px-3 py-2.5 flex items-end gap-2">
            <Textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={isAdmin ? "Reply to user…" : "Write a message to the owner…"}
              className="resize-none min-h-10 max-h-32 rounded-2xl text-sm"
              rows={1}
            />
            <Button onClick={send} disabled={sending || !draft.trim()} size="icon" className="rounded-full h-10 w-10 shrink-0 bg-gradient-to-br from-sky-500 to-blue-600">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OwnerChatPage;