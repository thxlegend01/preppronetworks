import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Paperclip, Radio, Reply, Send, Users, X, Trash2, Pencil, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ProfileLite, fetchProfiles, initialsOf, nameOf, timeAgo, uploadChatMedia } from "@/lib/prepchat";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  media_name: string | null;
  reply_to_id: string | null;
  is_edited: boolean;
  is_pinned: boolean;
  deleted_for_everyone: boolean;
  deleted_for: string[] | null;
  created_at: string;
}

interface Conv {
  id: string;
  type: "dm" | "group" | "channel";
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  created_by: string;
}

const REACTIONS = ["👍", "❤️", "🔥", "😂", "🙏"];

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [conv, setConv] = useState<Conv | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [partner, setPartner] = useState<ProfileLite | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [reactions, setReactions] = useState<Record<string, { emoji: string; user_id: string }[]>>({});
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const [editing, setEditing] = useState<Msg | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!id || !user) return;
    const [{ data: c }, { data: members }, { data: m }] = await Promise.all([
      supabase.from("chat_conversations").select("id, type, title, description, avatar_url, created_by").eq("id", id).maybeSingle(),
      supabase.from("chat_members").select("user_id, role").eq("conversation_id", id),
      supabase.from("chat_messages").select("*").eq("conversation_id", id).order("created_at", { ascending: true }).limit(500),
    ]);
    setConv((c as Conv) || null);
    const mem = (members || []) as { user_id: string; role: string }[];
    setMemberCount(mem.length);
    setMyRole(mem.find((x) => x.user_id === user.id)?.role || null);
    const list = (m as Msg[]) || [];
    setMsgs(list);

    const ids = [...mem.map((x) => x.user_id), ...list.map((x) => x.sender_id)];
    const profs = await fetchProfiles(ids);
    setProfiles(profs);
    if ((c as Conv)?.type === "dm") {
      const other = mem.find((x) => x.user_id !== user.id);
      setPartner(other ? profs[other.user_id] || null : null);
    }

    if (list.length) {
      const { data: rx } = await supabase
        .from("chat_message_reactions")
        .select("message_id, emoji, user_id")
        .in("message_id", list.map((x) => x.id));
      const map: Record<string, { emoji: string; user_id: string }[]> = {};
      (rx || []).forEach((r) => {
        (map[r.message_id] ||= []).push({ emoji: r.emoji, user_id: r.user_id });
      });
      setReactions(map);
    }

    await supabase.from("chat_members").update({ last_read_at: new Date().toISOString() }).eq("conversation_id", id).eq("user_id", user.id);
    setLoading(false);
  }, [id, user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!id) return;
    const ch = supabase
      .channel(`conv-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_message_reactions" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, load]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const visible = useMemo(
    () => msgs.filter((m) => !(m.deleted_for || []).includes(user?.id || "")),
    [msgs, user]
  );
  const pinned = visible.find((m) => m.is_pinned && !m.deleted_for_everyone);

  const canPost = conv?.type !== "channel" || myRole === "owner" || myRole === "admin";

  const send = async () => {
    if (!user || !id || !text.trim()) return;
    setSending(true);
    if (editing) {
      const { error } = await supabase.from("chat_messages").update({ content: text.trim(), is_edited: true }).eq("id", editing.id);
      if (error) toast.error("Could not edit");
      setEditing(null);
    } else {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: id, sender_id: user.id, content: text.trim(), reply_to_id: replyTo?.id || null,
      });
      if (error) toast.error(error.message);
      setReplyTo(null);
    }
    setText("");
    setSending(false);
    load();
  };

  const sendMedia = async (file: File) => {
    if (!user || !id) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setSending(true);
    try {
      const url = await uploadChatMedia(file, user.id);
      await supabase.from("chat_messages").insert({
        conversation_id: id, sender_id: user.id, media_url: url,
        media_type: file.type, media_name: file.name, reply_to_id: replyTo?.id || null,
      });
      setReplyTo(null);
      load();
    } catch {
      toast.error("Upload failed");
    } finally {
      setSending(false);
    }
  };

  const react = async (msg: Msg, emoji: string) => {
    if (!user) return;
    const existing = (reactions[msg.id] || []).find((r) => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("chat_message_reactions").delete().eq("message_id", msg.id).eq("user_id", user.id).eq("emoji", emoji);
    } else {
      await supabase.from("chat_message_reactions").insert({ message_id: msg.id, user_id: user.id, emoji });
    }
    load();
  };

  const deleteForMe = async (msg: Msg) => {
    if (!user) return;
    await supabase.from("chat_messages").update({ deleted_for: [...(msg.deleted_for || []), user.id] }).eq("id", msg.id);
    load();
  };
  const deleteForEveryone = async (msg: Msg) => {
    await supabase.from("chat_messages").update({ deleted_for_everyone: true, content: null, media_url: null }).eq("id", msg.id);
    load();
  };
  const togglePin = async (msg: Msg) => {
    await supabase.from("chat_messages").update({ is_pinned: !msg.is_pinned }).eq("id", msg.id);
    load();
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!conv) return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">Chat not found.</div>;

  const headerTitle = conv.type === "dm" ? nameOf(partner) : conv.title || "Untitled";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl px-3 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/prepchat/chats")} className="p-1.5 -ml-1 rounded-full hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
          <button
            onClick={() => conv.type === "dm" && partner?.username && navigate(`/prepchat/u/${partner.username}`)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold text-sm shrink-0">
              {conv.type === "dm"
                ? (partner?.avatar_url ? <img src={partner.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(partner))
                : conv.avatar_url ? <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                : conv.type === "channel" ? <Radio className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{headerTitle}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {conv.type === "dm" ? (partner?.username ? `@${partner.username}` : "Direct message") : `${memberCount} members`}
              </p>
            </div>
          </button>
        </div>
        {pinned && (
          <div className="mx-auto max-w-2xl px-3 pb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Pin className="w-3 h-3 shrink-0" />
            <span className="truncate">{pinned.content || pinned.media_name}</span>
          </div>
        )}
      </header>

      <div className="flex-1 mx-auto w-full max-w-2xl px-3 py-4 space-y-2">
        {visible.map((m) => {
          const mine = m.sender_id === user?.id;
          const p = profiles[m.sender_id];
          const parent = m.reply_to_id ? msgs.find((x) => x.id === m.reply_to_id) : null;
          const rx = reactions[m.id] || [];
          const grouped = rx.reduce<Record<string, number>>((a, r) => { a[r.emoji] = (a[r.emoji] || 0) + 1; return a; }, {});
          return (
            <div key={m.id} className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
              {!mine && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white text-[10px] font-bold shrink-0 mt-auto">
                  {p?.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(p)}
                </div>
              )}
              <div className={cn("max-w-[78%] group")}>
                {!mine && conv.type !== "dm" && (
                  <p className="text-[11px] font-bold text-primary mb-0.5 px-1">{nameOf(p)}</p>
                )}
                <div className={cn(
                  "rounded-2xl px-3 py-2 text-sm break-words",
                  mine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                )}>
                  {parent && !m.deleted_for_everyone && (
                    <div className={cn("text-[11px] mb-1 pl-2 border-l-2 opacity-80 truncate", mine ? "border-primary-foreground/50" : "border-primary")}>
                      {parent.content || parent.media_name || "attachment"}
                    </div>
                  )}
                  {m.deleted_for_everyone ? (
                    <span className="italic opacity-70">🚫 This message was deleted</span>
                  ) : (
                    <>
                      {m.media_url && (m.media_type?.startsWith("image/")
                        ? <img src={m.media_url} alt={m.media_name || "attachment"} className="rounded-xl max-h-72 mb-1" />
                        : <a href={m.media_url} target="_blank" rel="noreferrer" className="underline text-xs block mb-1">📎 {m.media_name}</a>)}
                      {m.content}
                    </>
                  )}
                  <div className={cn("text-[10px] mt-1 flex items-center gap-1", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {timeAgo(m.created_at)}{m.is_edited && " · edited"}
                  </div>
                </div>

                {!!Object.keys(grouped).length && (
                  <div className={cn("flex gap-1 mt-1", mine ? "justify-end" : "justify-start")}>
                    {Object.entries(grouped).map(([e, n]) => (
                      <button key={e} onClick={() => react(m, e)} className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted ring-1 ring-border">
                        {e} {n}
                      </button>
                    ))}
                  </div>
                )}

                {!m.deleted_for_everyone && (
                  <div className={cn("flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition", mine ? "justify-end" : "justify-start")}>
                    {REACTIONS.map((e) => (
                      <button key={e} onClick={() => react(m, e)} className="text-xs hover:scale-125 transition">{e}</button>
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-[11px] text-muted-foreground px-1">•••</DropdownMenuTrigger>
                      <DropdownMenuContent align={mine ? "end" : "start"}>
                        <DropdownMenuItem onClick={() => setReplyTo(m)}><Reply className="w-4 h-4 mr-2" /> Reply</DropdownMenuItem>
                        {(myRole === "owner" || myRole === "admin") && (
                          <DropdownMenuItem onClick={() => togglePin(m)}><Pin className="w-4 h-4 mr-2" /> {m.is_pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
                        )}
                        {mine && m.content && (
                          <DropdownMenuItem onClick={() => { setEditing(m); setText(m.content || ""); }}><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => deleteForMe(m)}><Trash2 className="w-4 h-4 mr-2" /> Delete for me</DropdownMenuItem>
                        {mine && (
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteForEveryone(m)}><Trash2 className="w-4 h-4 mr-2" /> Delete for everyone</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="mx-auto max-w-2xl px-3 py-2">
          {(replyTo || editing) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 bg-muted rounded-xl px-3 py-1.5">
              <span className="flex-1 truncate">{editing ? "Editing" : "Replying to"}: {(editing || replyTo)?.content || (editing || replyTo)?.media_name}</span>
              <button onClick={() => { setReplyTo(null); setEditing(null); setText(""); }}><X className="w-4 h-4" /></button>
            </div>
          )}
          {canPost ? (
            <div className="flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()} className="p-2 rounded-full hover:bg-muted text-muted-foreground shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) sendMedia(f); e.target.value = ""; }} />
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Message…"
                className="rounded-full h-10"
              />
              <Button size="icon" className="rounded-full h-10 w-10 shrink-0" onClick={send} disabled={sending || !text.trim()}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-2">Only admins can post in this channel.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;