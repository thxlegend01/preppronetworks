import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ArrowLeft, Send, Loader2, LogIn, Shield, Search, Trash2, Paperclip, Image as ImageIcon, Video, File as FileIcon, X, Pencil, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface Msg {
  id: string;
  user_id: string;
  sender_id: string;
  content: string;
  from_owner: boolean;
  created_at: string;
  media_url?: string | null;
  media_type?: string | null;
  media_name?: string | null;
  is_edited?: boolean | null;
}
interface Profile { user_id: string; display_name: string | null; username: string | null; avatar_url: string | null; }

const OwnerChatPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin: isAdminAccount } = useIsAdmin();
  const [userMode, setUserMode] = useState(false);
  const isAdmin = isAdminAccount && !userMode;

  // Admin password gate
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Mark owner chat as seen on open (for non-admin users)
  useEffect(() => {
    localStorage.setItem("owner_chat_seen_ts", String(Date.now()));
  }, []);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
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
    if (!user) return;
    if (!draft.trim() && !pendingFile) return;
    const targetUserId = isAdmin ? activeThread : user.id;
    if (!targetUserId) return;
    setSending(true);
    let media_url: string | null = null;
    let media_type: string | null = null;
    let media_name: string | null = null;
    if (pendingFile) {
      setUploading(true);
      const ext = pendingFile.name.split(".").pop() || "bin";
      const path = `owner-chat/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("chat-media").upload(path, pendingFile, { contentType: pendingFile.type, upsert: false });
      setUploading(false);
      if (upErr) { setSending(false); toast({ variant: "destructive", title: "Upload failed", description: upErr.message }); return; }
      const { data } = supabase.storage.from("chat-media").getPublicUrl(path);
      media_url = data.publicUrl;
      media_type = pendingFile.type || "application/octet-stream";
      media_name = pendingFile.name;
    }
    const { error } = await supabase.from("owner_messages").insert({
      user_id: targetUserId,
      sender_id: user.id,
      content: draft.trim(),
      from_owner: isAdmin,
      media_url, media_type, media_name,
    } as any);
    setSending(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setDraft(""); setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("owner_messages").delete().eq("id", id);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
  };

  const startEdit = (m: Msg) => { setEditingId(m.id); setEditText(m.content || ""); };
  const cancelEdit = () => { setEditingId(null); setEditText(""); };
  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("owner_messages").update({ content: editText.trim(), is_edited: true } as any).eq("id", id);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    cancelEdit();
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) { toast({ variant: "destructive", title: "File too large", description: "Max 25 MB" }); return; }
    setPendingFile(f);
  };

  if (authLoading || loading) {
    return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  // Admin password gate for owner inbox
  if (isAdminAccount && !adminUnlocked && !userMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (adminPwd.trim() === "Saurabh") { setAdminUnlocked(true); setPwdError(""); }
            else setPwdError("Incorrect password");
          }}
          className="w-full max-w-sm p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 grid place-items-center mx-auto">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h2 className="font-black text-xl">Admin Access</h2>
            <p className="text-xs text-muted-foreground mt-1">Enter the admin password to open the Owner Inbox.</p>
          </div>
          <Input type="password" value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} placeholder="Password" autoFocus className="rounded-xl" />
          {pwdError && <p className="text-xs text-destructive text-center">{pwdError}</p>}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/")} className="flex-1 rounded-full">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-full">Continue With Admin Profile</Button>
          </div>
          <Button type="button" variant="outline" onClick={() => setUserMode(true)} className="w-full rounded-full">
            Continue as User
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            No password? Continue as a normal user and chat with the owner instead.
          </p>
        </form>
      </div>
    );
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
              const canModify = mine || isAdmin;
              const isImg = m.media_type?.startsWith("image/");
              const isVid = m.media_type?.startsWith("video/");
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"} group`}>
                  <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-md" : "bg-card border border-border/60 text-foreground rounded-bl-md"}`}>
                    {m.media_url && (
                      <div className="mb-1.5 rounded-xl overflow-hidden">
                        {isImg ? (
                          <a href={m.media_url} target="_blank" rel="noopener noreferrer"><img src={m.media_url} alt={m.media_name || "image"} className="max-h-72 w-auto rounded-xl" loading="lazy" /></a>
                        ) : isVid ? (
                          <video src={m.media_url} controls className="max-h-72 w-full rounded-xl bg-black" />
                        ) : (
                          <a href={m.media_url} target="_blank" rel="noopener noreferrer" download={m.media_name || true} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${mine ? "border-white/30 bg-white/10 hover:bg-white/15" : "border-border/60 bg-muted hover:bg-muted/70"}`}>
                            <FileIcon className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-medium truncate flex-1">{m.media_name || "Attachment"}</span>
                            <Download className="w-4 h-4 shrink-0 opacity-70" />
                          </a>
                        )}
                      </div>
                    )}
                    {editingId === m.id ? (
                      <div className="space-y-1.5">
                        <Textarea value={editText} onChange={e => setEditText(e.target.value)} className="resize-none min-h-10 max-h-32 rounded-xl text-sm text-foreground" rows={1} />
                        <div className="flex gap-1 justify-end">
                          <button onClick={cancelEdit} className={`text-[11px] px-2 py-1 rounded-md ${mine ? "bg-white/20 hover:bg-white/30 text-white" : "bg-muted hover:bg-muted/70"}`}>Cancel</button>
                          <button onClick={() => saveEdit(m.id)} className={`text-[11px] px-2 py-1 rounded-md font-bold ${mine ? "bg-white text-sky-700 hover:bg-white/90" : "bg-primary text-primary-foreground"}`}>Save</button>
                        </div>
                      </div>
                    ) : (
                      m.content && <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    )}
                    <div className={`flex items-center justify-end gap-1.5 mt-0.5 text-[10px] ${mine ? "text-white/75" : "text-muted-foreground"}`}>
                      {m.is_edited && <span className="italic">edited</span>}
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {canModify && editingId !== m.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          {mine && m.content && (
                            <button onClick={() => startEdit(m)} className="hover:text-foreground" title="Edit"><Pencil className="w-3 h-3" /></button>
                          )}
                          <button onClick={() => deleteMsg(m.id)} className="hover:text-destructive" title="Delete"><Trash2 className="w-3 h-3" /></button>
                        </div>
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
          {pendingFile && (
            <div className="container mx-auto max-w-2xl px-3 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border/60">
                {pendingFile.type.startsWith("image/") ? <ImageIcon className="w-4 h-4 text-sky-500" /> : pendingFile.type.startsWith("video/") ? <Video className="w-4 h-4 text-violet-500" /> : <FileIcon className="w-4 h-4 text-muted-foreground" />}
                <span className="text-xs font-medium truncate flex-1">{pendingFile.name}</span>
                <span className="text-[10px] text-muted-foreground">{(pendingFile.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => { setPendingFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="p-1 rounded hover:bg-background"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
          <div className="container mx-auto max-w-2xl px-3 py-2.5 flex items-end gap-2">
            <input ref={fileRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt" className="hidden" onChange={onPickFile} />
            <Button type="button" onClick={() => fileRef.current?.click()} size="icon" variant="ghost" className="rounded-full h-10 w-10 shrink-0" title="Attach">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={pendingFile ? "Add a caption…" : isAdmin ? "Reply to user…" : "Write a message to the owner…"}
              className="resize-none min-h-10 max-h-32 rounded-2xl text-sm"
              rows={1}
            />
            <Button onClick={send} disabled={sending || uploading || (!draft.trim() && !pendingFile)} size="icon" className="rounded-full h-10 w-10 shrink-0 bg-gradient-to-br from-sky-500 to-blue-600">
              {sending || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OwnerChatPage;