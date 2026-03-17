import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoomData } from "@/pages/PrepChatPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  ArrowLeft, Send, Smile, Image as ImageIcon, Sparkles, Pin, X, Users,
} from "lucide-react";
import MessageBubble, { ChatMessage, MessageReaction } from "./MessageBubble";

const EMOJI_LIST = ["😀","😂","😍","🤔","😎","🙏","🔥","💪","📚","✅","❤️","👍","👎","😢","😮","🎯","💡","⭐","🚀","✨"];
const QUICK_REACTIONS = ["❤️","👍","😂","😮","🔥","💯"];

interface Props {
  room: ChatRoomData;
  userId: string;
  onBack: () => void;
  isMobile: boolean;
}

const ChatRoom = ({ room, userId, onBack, isMobile }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null }>({ display_name: null, avatar_url: null });
  const [pinnedMessages, setPinnedMessages] = useState<ChatMessage[]>([]);
  const [showPinned, setShowPinned] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch profile
  useEffect(() => {
    supabase.from("profiles").select("display_name, avatar_url").eq("user_id", userId).maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [userId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("room_messages")
      .select("*")
      .eq("room_id", room.id)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data) {
      setMessages(data as unknown as ChatMessage[]);
      setPinnedMessages((data as unknown as ChatMessage[]).filter((m) => m.is_pinned));
    }
  }, [room.id]);

  // Fetch reactions
  const fetchReactions = useCallback(async () => {
    const msgIds = messages.map((m) => m.id);
    if (msgIds.length === 0) return;
    const { data } = await supabase
      .from("message_reactions")
      .select("*")
      .in("message_id", msgIds);
    if (data) setReactions(data as MessageReaction[]);
  }, [messages]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { fetchReactions(); }, [messages.length]);

  // Realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`room-${room.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "room_messages", filter: `room_id=eq.${room.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => [...prev, payload.new as unknown as ChatMessage]);
        } else if (payload.eventType === "UPDATE") {
          setMessages((prev) => prev.map((m) => m.id === (payload.new as any).id ? (payload.new as unknown as ChatMessage) : m));
        } else if (payload.eventType === "DELETE") {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "message_reactions" }, () => {
        fetchReactions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room.id, fetchReactions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Join room
  useEffect(() => {
    const join = async () => {
      const { data: existing } = await supabase
        .from("room_participants")
        .select("id")
        .eq("room_id", room.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (!existing) {
        await supabase.from("room_participants").insert({ room_id: room.id, user_id: userId });
      }
    };
    join();
    return () => {
      supabase.from("room_participants").delete().eq("room_id", room.id).eq("user_id", userId);
    };
  }, [room.id, userId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !editingMsg) return;

    // AI command
    if (text.startsWith("/ai ")) {
      const question = text.slice(4).trim();
      if (!question) return;
      setInput("");
      setAiLoading(true);

      // Send user message
      await supabase.from("room_messages").insert({
        room_id: room.id,
        user_id: userId,
        content: text,
        message_type: "text",
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      } as any);

      try {
        const { data, error } = await supabase.functions.invoke("chat-ai", {
          body: { message: question },
        });
        if (error) throw error;
        await supabase.from("room_messages").insert({
          room_id: room.id,
          user_id: userId,
          content: `🤖 **AI Assistant:**\n\n${data.reply}`,
          message_type: "ai",
          display_name: "PrepPro AI",
          avatar_url: null,
        } as any);
      } catch {
        toast.error("AI is busy, try again later");
      }
      setAiLoading(false);
      return;
    }

    // Edit mode
    if (editingMsg) {
      await supabase
        .from("room_messages")
        .update({ content: text, is_edited: true } as any)
        .eq("id", editingMsg.id);
      setEditingMsg(null);
      setInput("");
      return;
    }

    // Normal message
    const payload: any = {
      room_id: room.id,
      user_id: userId,
      content: text,
      message_type: "text",
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    };
    if (replyTo) payload.reply_to_id = replyTo.id;

    await supabase.from("room_messages").insert(payload);
    setInput("");
    setReplyTo(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Max 10MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${room.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("chat-media").upload(path, file);
    if (error) { toast.error("Upload failed"); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("chat-media").getPublicUrl(path);
    const isImage = file.type.startsWith("image/");

    await supabase.from("room_messages").insert({
      room_id: room.id,
      user_id: userId,
      content: file.name,
      message_type: isImage ? "image" : "file",
      media_url: urlData.publicUrl,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    } as any);
    setUploading(false);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    const existing = reactions.find((r) => r.message_id === messageId && r.user_id === userId && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: messageId, user_id: userId, emoji });
    }
  };

  const handleDelete = async (msgId: string) => {
    await supabase.from("room_messages").delete().eq("id", msgId);
  };

  const handlePin = async (msg: ChatMessage) => {
    await supabase.from("room_messages").update({ is_pinned: !msg.is_pinned } as any).eq("id", msg.id);
  };

  const handleEdit = (msg: ChatMessage) => {
    setEditingMsg(msg);
    setInput(msg.content || "");
    inputRef.current?.focus();
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0 gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" className="shrink-0" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground truncate text-sm">{room.name}</h2>
          <p className="text-xs text-muted-foreground truncate">{room.description}</p>
        </div>
        <div className="flex items-center gap-1">
          {pinnedMessages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={() => setShowPinned(!showPinned)} className="relative">
              <Pin className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {pinnedMessages.length}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Pinned messages banner */}
      {showPinned && pinnedMessages.length > 0 && (
        <div className="bg-primary/5 border-b border-primary/20 p-3 max-h-32 overflow-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-primary flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>
            <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => setShowPinned(false)}><X className="w-3 h-3" /></Button>
          </div>
          {pinnedMessages.map((m) => (
            <p key={m.id} className="text-xs text-foreground truncate">{m.display_name}: {m.content}</p>
          ))}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {/* Welcome message */}
        <div className="text-center py-6 mb-4">
          <div className="inline-block bg-primary/5 rounded-2xl px-6 py-4">
            <p className="text-sm font-semibold text-foreground">Welcome to PrepPro Network Study Chat 🚀</p>
            <p className="text-xs text-muted-foreground mt-1">Discuss doubts, help others, and crack JEE/NEET together.</p>
            <p className="text-xs text-muted-foreground mt-1">💡 Type <code className="bg-secondary px-1 rounded">/ai your question</code> for AI doubt solving</p>
          </div>
        </div>

        {messages.map((msg) => {
          const msgReactions = reactions.filter((r) => r.message_id === msg.id);
          const repliedMsg = msg.reply_to_id ? messages.find((m) => m.id === msg.reply_to_id) : null;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.user_id === userId}
              reactions={msgReactions}
              repliedMessage={repliedMsg || null}
              onReply={() => handleReply(msg)}
              onEdit={() => handleEdit(msg)}
              onDelete={() => handleDelete(msg.id)}
              onPin={() => handlePin(msg)}
              onReact={(emoji) => handleReaction(msg.id, emoji)}
              quickReactions={QUICK_REACTIONS}
              userId={userId}
            />
          );
        })}

        {aiLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Sparkles className="w-4 h-4 animate-pulse text-primary" />
            AI is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Reply/Edit bar */}
      {(replyTo || editingMsg) && (
        <div className="px-4 py-2 bg-secondary/50 border-t border-border flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-primary">
              {editingMsg ? "Editing message" : `Replying to ${replyTo?.display_name || "user"}`}
            </span>
            <p className="text-xs text-muted-foreground truncate">
              {(editingMsg || replyTo)?.content}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0" onClick={() => { setReplyTo(null); setEditingMsg(null); setInput(""); }}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-card p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*,video/*,.pdf" className="hidden" onChange={handleFileUpload} />

          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setShowEmoji(!showEmoji)}>
            <Smile className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={editingMsg ? "Edit message..." : "Type a message... (/ai for AI)"}
            className="flex-1 bg-secondary/50 border-0 h-10"
          />

          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || uploading}
            className="shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Emoji picker */}
        {showEmoji && (
          <div className="mt-2 p-2 bg-secondary/50 rounded-lg flex flex-wrap gap-1">
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                className="w-9 h-9 flex items-center justify-center text-lg hover:bg-background rounded-md transition-colors"
                onClick={() => { setInput((prev) => prev + e); setShowEmoji(false); inputRef.current?.focus(); }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
