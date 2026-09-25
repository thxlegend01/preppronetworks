import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, Smile, Image, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadChatMediaSigned } from "@/lib/chatMedia";

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string | null;
  message_type: string;
  media_url: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const STICKERS = [
  "📚", "✍️", "🧠", "💡", "🔥", "💪", "🎯", "⭐",
  "🏆", "📖", "✅", "❤️", "👏", "🤔", "😊", "🚀",
  "💯", "🎉", "👍", "🙏", "😂", "😭", "🤯", "😤",
];

interface RoomChatWidgetProps {
  roomId: string;
  roomName: string;
}

const RoomChatWidget = ({ roomId, roomName }: RoomChatWidgetProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null }>({
    display_name: null,
    avatar_url: null,
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const fetchMessages = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("room_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data) setMessages(data);
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "room_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "room_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string, type: string = "text", mediaUrl?: string) => {
    if (!user) {
      toast.error("Login required to chat");
      return;
    }
    await (supabase as any).from("room_messages").insert({
      room_id: roomId,
      user_id: user.id,
      content,
      message_type: type,
      media_url: mediaUrl || null,
      display_name: profile.display_name || user.email?.split("@")[0] || "User",
      avatar_url: profile.avatar_url,
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  const handleSticker = async (sticker: string) => {
    setShowStickers(false);
    await sendMessage(sticker, "sticker");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Only images and videos allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max file size: 10MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${roomId}/${Date.now()}.${ext}`;
    let signedUrl: string;
    try {
      signedUrl = await uploadChatMediaSigned(path, file, file.type);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    await sendMessage(isVideo ? "📹 Video" : "📷 Photo", isVideo ? "video" : "image", signedUrl);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isOwn = (msg: Message) => msg.user_id === user?.id;

  return (
    <div className="flex flex-col h-[55vh] rounded-xl border border-border/50 bg-card/80 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">No messages yet. Say hi! 👋</p>
            <p className="text-[10px] text-muted-foreground mt-1">Type <code className="bg-muted px-1 rounded">/ai your question</code> to ask AI</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-2",
              isOwn(msg) ? "flex-row-reverse" : "",
              (msg.message_type === "system") && "justify-center"
            )}
          >
            {msg.message_type === "system" ? (
              <p className="text-[10px] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {msg.content}
              </p>
            ) : msg.message_type === "ai_response" ? (
              <div className="max-w-[88%] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-[10px] font-bold text-primary mb-1">🤖 AI Assistant</p>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className="text-[8px] text-muted-foreground mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ) : (
              <>
                {!isOwn(msg) && (
                  <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
                    <AvatarImage src={msg.avatar_url || ""} />
                    <AvatarFallback className="text-[10px]">
                      {(msg.display_name || "?")[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-[75%]", isOwn(msg) ? "items-end" : "items-start")}>
                  {!isOwn(msg) && (
                    <p className="text-[9px] text-muted-foreground mb-0.5 px-1">{msg.display_name}</p>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl",
                      msg.message_type === "sticker"
                        ? "text-3xl p-1"
                        : cn(
                            "px-3 py-2",
                            isOwn(msg) ? "bg-primary text-primary-foreground" : "bg-secondary"
                          )
                    )}
                  >
                    {msg.message_type === "image" && msg.media_url && (
                      <img
                        src={msg.media_url}
                        alt="shared"
                        className="rounded-lg max-w-full max-h-48 mb-1"
                        loading="lazy"
                      />
                    )}
                    {msg.message_type === "video" && msg.media_url && (
                      <video
                        src={msg.media_url}
                        controls
                        className="rounded-lg max-w-full max-h-48 mb-1"
                      />
                    )}
                    {msg.message_type === "sticker" ? (
                      <span>{msg.content}</span>
                    ) : msg.message_type === "ai_query" ? (
                      <p className="text-xs italic opacity-80">{msg.content}</p>
                    ) : (
                      <p className="text-xs">{msg.content}</p>
                    )}
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-0.5 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        ))}
        {isAiLoading && (
          <div className="flex items-center gap-2 text-primary px-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticker Picker */}
      <AnimatePresence>
        {showStickers && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="grid grid-cols-8 gap-1 p-2">
              {STICKERS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSticker(s)}
                  className="text-2xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-muted/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="border-t border-border/30 p-2 flex items-center gap-1">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setShowStickers(!showStickers)}
        >
          <Smile className="w-4 h-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message"
          className="h-8 text-xs flex-1 min-w-0"
        />
        <Button
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoomChatWidget;
