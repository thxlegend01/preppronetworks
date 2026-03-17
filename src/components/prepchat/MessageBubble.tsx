import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Reply, Edit2, Trash2, Pin, Flag, Sparkles } from "lucide-react";

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string | null;
  message_type: string;
  media_url: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  reply_to_id: string | null;
  is_edited: boolean;
  is_pinned: boolean;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  reactions: MessageReaction[];
  repliedMessage: ChatMessage | null;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  quickReactions: string[];
  userId: string;
}

const MessageBubble = ({
  message, isOwn, reactions, repliedMessage, onReply, onEdit, onDelete, onPin, onReact, quickReactions, userId,
}: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const isAI = message.message_type === "ai";
  const isSystem = message.message_type === "system";
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Group reactions by emoji
  const groupedReactions = reactions.reduce<Record<string, { count: number; hasOwn: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, hasOwn: false };
    acc[r.emoji].count++;
    if (r.user_id === userId) acc[r.emoji].hasOwn = true;
    return acc;
  }, {});

  if (isSystem) {
    return (
      <div className="text-center py-2">
        <span className="text-xs bg-secondary/80 text-muted-foreground px-3 py-1 rounded-full">{message.content}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 mb-3 group", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && (
        <Avatar className="w-8 h-8 shrink-0 mt-1">
          <AvatarImage src={message.avatar_url || undefined} />
          <AvatarFallback className={cn("text-xs font-semibold", isAI ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
            {isAI ? "AI" : (message.display_name || "U")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[75%] min-w-[120px]", isOwn ? "items-end" : "items-start")}>
        {/* Name + time */}
        <div className={cn("flex items-center gap-2 mb-0.5 px-1", isOwn ? "flex-row-reverse" : "flex-row")}>
          <span className={cn("text-xs font-semibold", isAI ? "text-primary" : "text-muted-foreground")}>
            {isAI && <Sparkles className="w-3 h-3 inline mr-1" />}
            {message.display_name || "User"}
          </span>
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {message.is_pinned && <Pin className="w-3 h-3 text-primary" />}
          {message.is_edited && <span className="text-[10px] text-muted-foreground italic">edited</span>}
        </div>

        {/* Reply preview */}
        {repliedMessage && (
          <div className={cn(
            "text-xs px-3 py-1.5 mb-1 rounded-lg border-l-2 border-primary/50 bg-secondary/50",
            isOwn ? "ml-auto" : ""
          )}>
            <span className="font-medium text-primary">{repliedMessage.display_name}</span>
            <p className="text-muted-foreground truncate">{repliedMessage.content}</p>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          "relative rounded-2xl px-3.5 py-2 text-sm",
          isOwn
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : isAI
              ? "bg-primary/5 border border-primary/20 text-foreground rounded-tl-md"
              : "bg-secondary text-foreground rounded-tl-md"
        )}>
          {/* Media */}
          {message.media_url && message.message_type === "image" && (
            <img
              src={message.media_url}
              alt="shared"
              className="rounded-lg max-h-60 object-cover mb-1 cursor-pointer"
              onClick={() => window.open(message.media_url!, "_blank")}
            />
          )}
          {message.media_url && message.message_type === "file" && (
            <a href={message.media_url} target="_blank" rel="noopener noreferrer" className="text-xs underline block mb-1">
              📎 {message.content}
            </a>
          )}
          {message.message_type !== "file" && message.content && (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          )}

          {/* Actions */}
          <div className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "-left-8" : "-right-8"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-secondary/80">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "start" : "end"} className="w-44">
                <DropdownMenuItem onClick={onReply}><Reply className="w-4 h-4 mr-2" />Reply</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowReactions(!showReactions)}>😀 React</DropdownMenuItem>
                <DropdownMenuItem onClick={onPin}><Pin className="w-4 h-4 mr-2" />{message.is_pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
                {isOwn && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onEdit}><Edit2 className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                  </>
                )}
                {!isOwn && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Flag className="w-4 h-4 mr-2" />Report</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick reactions */}
        {showReactions && (
          <div className={cn("flex gap-1 mt-1 flex-wrap", isOwn ? "justify-end" : "justify-start")}>
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { onReact(emoji); setShowReactions(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reactions display */}
        {Object.keys(groupedReactions).length > 0 && (
          <div className={cn("flex gap-1 mt-1 flex-wrap", isOwn ? "justify-end" : "justify-start")}>
            {Object.entries(groupedReactions).map(([emoji, { count, hasOwn }]) => (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                  hasOwn ? "bg-primary/10 border-primary/30" : "bg-secondary border-border hover:bg-secondary/80"
                )}
              >
                <span>{emoji}</span>
                <span className="text-muted-foreground">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
