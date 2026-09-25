import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadChatMediaSigned } from "@/lib/chatMedia";
import {
  ArrowLeft, Send, Loader2, Paperclip, X, Reply, MoreVertical, Trash2, ShieldAlert, AtSign, Ban,
} from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DM {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  media_name: string | null;
  reply_to_id: string | null;
  is_edited: boolean;
  deleted_for_everyone: boolean;
  deleted_for: string[] | null;
  created_at: string;
}
interface Profile { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; }

const DirectMessagePage = () => {
  const { userId: partnerId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partner, setPartner] = useState<Profile | null>(null);
  const [msgs, setMsgs] = useState<DM[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<DM | null>(null);
  const [blockedEither, setBlockedEither] = useState<{ mine: boolean; theirs: boolean }>({ mine: false, theirs: false });
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    if (!user || !partnerId) return;
    const [{ data: p }, { data: m }, { data: bm }, { data: bt }] = await Promise.all([
      supabase.from("profiles").select("user_id, username, display_name, avatar_url").eq("user_id", partnerId).maybeSingle(),
      supabase
        .from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true })
        .limit(500),
      supabase.from("user_blocks").select("id").eq("blocker_id", user.id).eq("blocked_id", partnerId).maybeSingle(),
      supabase.from("user_blocks").select("id").eq("blocker_id", partnerId).eq("blocked_id", user.id).maybeSingle(),
    ]);
    setPartner((p as Profile) || null);
    setMsgs((m as DM[]) || []);
    setBlockedEither({ mine: !!bm, theirs: !!bt });
    setLoading(false);
  }, [user, partnerId]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchAll();
    // unhide thread if reopened
    supabase.from("dm_hidden_threads").delete().eq("user_id", user.id).eq("partner_id", partnerId!);
    const ch = supabase
      .channel(`dm-${user.id}-${partnerId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, (payload: any) => {
        const row = payload.new || payload.old;
        if (!row) return;
        const involves = (row.sender_id === user.id && row.recipient_id === partnerId) || (row.sender_id === partnerId && row.recipient_id === user.id);
        if (involves) fetchAll();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, partnerId, fetchAll]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const visibleMsgs = useMemo(() => {
    if (!user) return [];
    return msgs.filter(m => !(m.deleted_for || []).includes(user.id));
  }, [msgs, user]);

  const canSend = !blockedEither.mine && !blockedEither.theirs;

  const send = async () => {
    if (!user || !partnerId) return;
    if (!draft.trim() && !pendingFile) return;
    if (!canSend) return;
    setSending(true);
    let media_url: string | null = null;
    let media_type: string | null = null;
    let media_name: string | null = null;
    if (pendingFile) {
      const ext = pendingFile.name.split(".").pop() || "bin";
      const path = `${user.id}/dm/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      try {
        media_url = await uploadChatMediaSigned(path, pendingFile, pendingFile.type);
      } catch (e: any) {
        setSending(false);
        toast({ variant: "destructive", title: "Upload failed", description: e?.message });
        return;
      }
      media_type = pendingFile.type || "application/octet-stream";
      media_name = pendingFile.name;
    }
    const { error } = await supabase.from("direct_messages").insert({
      sender_id: user.id,
      recipient_id: partnerId,
      content: draft.trim() || null,
      media_url, media_type, media_name,
      reply_to_id: replyTo?.id || null,
    } as any);
    setSending(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setDraft(""); setPendingFile(null); setReplyTo(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteForMe = async (m: DM) => {
    if (!user) return;
    const arr = m.deleted_for || [];
    if (arr.includes(user.id)) return;
    await supabase.from("direct_messages").update({ deleted_for: [...arr, user.id] as any }).eq("id", m.id);
  };

  const deleteForEveryone = async (m: DM) => {
    if (!user || m.sender_id !== user.id) return;
    if (!confirm("Delete this message for everyone?")) return;
    await supabase.from("direct_messages").update({ deleted_for_everyone: true, content: null, media_url: null } as any).eq("id", m.id);
  };

  const deleteWholeChat = async () => {
    if (!user || !partnerId) return;
    if (!confirm("Delete this entire chat from your inbox?")) return;
    for (const m of msgs) {
      const arr = m.deleted_for || [];
      if (!arr.includes(user.id)) {
        await supabase.from("direct_messages").update({ deleted_for: [...arr, user.id] as any }).eq("id", m.id);
      }
    }
    await supabase.from("dm_hidden_threads").upsert({ user_id: user.id, partner_id: partnerId }, { onConflict: "user_id,partner_id" });
    toast({ title: "Chat deleted from your inbox" });
    navigate("/dm");
  };

  const toggleBlock = async () => {
    if (!user || !partnerId) return;
    if (blockedEither.mine) {
      await supabase.from("user_blocks").delete().eq("blocker_id", user.id).eq("blocked_id", partnerId);
      setBlockedEither(s => ({ ...s, mine: false }));
      toast({ title: "Unblocked" });
    } else {
      await supabase.from("user_blocks").insert({ blocker_id: user.id, blocked_id: partnerId });
      setBlockedEither(s => ({ ...s, mine: true }));
      toast({ title: "Blocked" });
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 25 * 1024 * 1024) { toast({ variant: "destructive", title: "File too large", description: "Max 25 MB" }); return; }
    setPendingFile(f);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-xl font-bold">Login required</h1>
        <Button onClick={() => navigate("/auth")}>Login</Button>
      </div>
    );
  }
  if (!partner) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-xl font-bold">User not found</h1>
        <Button onClick={() => navigate("/dm")} variant="outline">Back to Inbox</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO title={`Chat with ${partner.display_name || partner.username} — PrepPro`} description="Private direct message on PrepPro Network." path={`/dm/${partner.user_id}`} />
      <div className="h-screen bg-background flex flex-col">
        <div className="bg-gradient-to-r from-primary/90 via-pink-500 to-fuchsia-600 shadow-lg shrink-0">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate("/dm")} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
            <Link to={`/u/${partner.username}`} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-primary font-black shrink-0 overflow-hidden">
                {partner.avatar_url ? <img src={partner.avatar_url} alt="" className="w-full h-full object-cover" /> : (partner.display_name || partner.username || "?")[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-white text-base leading-none truncate">{partner.display_name || partner.username}</h1>
                <p className="text-[11px] text-white/85 mt-0.5 flex items-center gap-1"><AtSign className="w-3 h-3" />{partner.username}</p>
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/15 rounded-full h-9 w-9"><MoreVertical className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/u/${partner.username}`)}>View profile</DropdownMenuItem>
                <DropdownMenuItem onClick={toggleBlock} className="text-destructive"><Ban className="w-4 h-4 mr-2" />{blockedEither.mine ? "Unblock" : "Block user"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={deleteWholeChat} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete chat (for me)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/owner-chat")}>Report to owner</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Transparent monitoring notice */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 shrink-0">
          <div className="container mx-auto max-w-2xl flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Private chats on PrepPro may be reviewed by admins for safety. Do not share OTPs or passwords.</span>
          </div>
        </div>

        {blockedEither.theirs && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-3 py-2 text-center text-xs text-destructive shrink-0">
            You cannot message this user.
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-2xl px-3 py-4 flex flex-col gap-2">
            {visibleMsgs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">Say hi 👋</div>
            )}
            {visibleMsgs.map(m => {
              const mine = m.sender_id === user.id;
              const isImg = m.media_type?.startsWith("image/");
              const isVid = m.media_type?.startsWith("video/");
              const repliedMsg = m.reply_to_id ? msgs.find(x => x.id === m.reply_to_id) : null;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"} group`}>
                  <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-gradient-to-br from-primary to-pink-500 text-white rounded-br-md" : "bg-card border border-border/60 text-foreground rounded-bl-md"}`}>
                    {repliedMsg && (
                      <div className={`mb-1.5 pl-2 border-l-2 text-[11px] rounded ${mine ? "border-white/60 text-white/85" : "border-primary text-muted-foreground"}`}>
                        <p className="font-semibold opacity-80">{repliedMsg.sender_id === user.id ? "You" : partner.display_name || "them"}</p>
                        <p className="truncate opacity-75">{repliedMsg.deleted_for_everyone ? "message deleted" : (repliedMsg.content || "[attachment]")}</p>
                      </div>
                    )}
                    {m.deleted_for_everyone ? (
                      <p className="italic opacity-70 text-xs">🚫 This message was deleted</p>
                    ) : (
                      <>
                        {m.media_url && (
                          <div className="mb-1.5 rounded-xl overflow-hidden">
                            {isImg ? <a href={m.media_url} target="_blank" rel="noopener noreferrer"><img src={m.media_url} alt="" className="max-h-72 rounded-xl" /></a>
                              : isVid ? <video src={m.media_url} controls className="max-h-72 w-full rounded-xl bg-black" />
                              : <a href={m.media_url} target="_blank" rel="noopener noreferrer" className={`text-xs underline ${mine ? "text-white" : "text-primary"}`}>{m.media_name || "Attachment"}</a>}
                          </div>
                        )}
                        {m.content && <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                      </>
                    )}
                    <div className={`flex items-center justify-end gap-1.5 mt-0.5 text-[10px] ${mine ? "text-white/75" : "text-muted-foreground"}`}>
                      {m.is_edited && !m.deleted_for_everyone && <span className="italic">edited</span>}
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {!m.deleted_for_everyone && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="opacity-0 group-hover:opacity-100 transition ml-0.5"><MoreVertical className="w-3 h-3" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setReplyTo(m)}><Reply className="w-4 h-4 mr-2" />Reply</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteForMe(m)}><Trash2 className="w-4 h-4 mr-2" />Delete for me</DropdownMenuItem>
                            {mine && <DropdownMenuItem onClick={() => deleteForEveryone(m)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete for everyone</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          {replyTo && (
            <div className="container mx-auto max-w-2xl px-3 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border-l-4 border-primary">
                <Reply className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-primary">Replying to {replyTo.sender_id === user.id ? "yourself" : partner.display_name || "user"}</p>
                  <p className="text-xs text-muted-foreground truncate">{replyTo.content || "[attachment]"}</p>
                </div>
                <button onClick={() => setReplyTo(null)} className="p-1 rounded hover:bg-background"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
          {pendingFile && (
            <div className="container mx-auto max-w-2xl px-3 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border/60">
                <Paperclip className="w-4 h-4 text-primary" />
                <span className="text-xs truncate flex-1">{pendingFile.name}</span>
                <button onClick={() => { setPendingFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="p-1 rounded hover:bg-background"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
          <div className="container mx-auto max-w-2xl px-3 py-2.5 flex items-end gap-2">
            <input ref={fileRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={onPickFile} />
            <Button type="button" onClick={() => fileRef.current?.click()} size="icon" variant="ghost" disabled={!canSend} className="rounded-full h-10 w-10 shrink-0"><Paperclip className="w-5 h-5" /></Button>
            <Textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={canSend ? "Type a message…" : "You can't message this user"}
              disabled={!canSend}
              className="resize-none min-h-10 max-h-32 rounded-2xl text-sm"
              rows={1}
            />
            <Button onClick={send} disabled={sending || !canSend || (!draft.trim() && !pendingFile)} size="icon" className="rounded-full h-10 w-10 shrink-0 bg-gradient-to-br from-primary to-pink-500">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DirectMessagePage;