import { useState } from "react";
import { motion } from "framer-motion";
import { useFriends } from "@/hooks/useFriends";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, X, Check, UserMinus, Circle, Search, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  studying: "text-green-500",
  break: "text-yellow-500",
  online: "text-blue-500",
  offline: "text-gray-400",
};

const FriendsWidget = () => {
  const { user } = useAuth();
  const { friends, pendingRequests, sendRequest, acceptRequest, rejectRequest, removeFriend } = useFriends();
  const [searchUsername, setSearchUsername] = useState("");

  if (!user) return null;

  const handleSend = async () => {
    if (!searchUsername.trim()) return;
    const result = await sendRequest(searchUsername.trim());
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Request sent!", description: `Friend request sent to @${searchUsername}` });
      setSearchUsername("");
    }
  };

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "";
    const diff = Date.now() - new Date(lastSeen).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-5">
      {/* Add Friend */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by username..."
          value={searchUsername}
          onChange={e => setSearchUsername(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          className="text-sm"
        />
        <Button size="sm" onClick={handleSend} disabled={!searchUsername.trim()} className="rounded-full">
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-bold text-primary">Pending Requests ({pendingRequests.length})</p>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={req.from_avatar_url || ""} />
                  <AvatarFallback className="text-xs">{(req.from_display_name || "?")[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold flex-1">{req.from_display_name || "Someone"}</span>
                <button onClick={() => acceptRequest(req.id, req.from_user_id)} className="p-1.5 rounded-full bg-green-500/15 text-green-500 hover:bg-green-500/25">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => rejectRequest(req.id)} className="p-1.5 rounded-full bg-destructive/15 text-destructive hover:bg-destructive/25">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-bold">Friends ({friends.length})</p>
        </div>
        <div className="space-y-2">
          {friends.map((friend, i) => (
            <motion.div
              key={friend.friend_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/80"
            >
              <div className="relative">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={friend.avatar_url || ""} />
                  <AvatarFallback className="text-xs">{(friend.display_name || "?")[0]}</AvatarFallback>
                </Avatar>
                <Circle className={cn("w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 fill-current", statusColors[friend.status || "offline"])} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{friend.display_name || friend.username || "Friend"}</p>
                <p className="text-[10px] text-muted-foreground">
                  {friend.status === "offline" ? `Last seen ${formatLastSeen(friend.last_seen)}` : friend.status === "studying" ? "📖 Studying now" : friend.status === "break" ? "☕ On break" : "🟢 Online"}
                </p>
              </div>
              <button onClick={() => removeFriend(friend.friend_id)} className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                <UserMinus className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {friends.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">No friends yet. Search by username to add!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsWidget;
