import { useState } from "react";
import { motion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const LeaderboardWidget = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const { entries, loading } = useLeaderboard(period);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-xs font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-bold">Leaderboard</h3>
        </div>
        <div className="flex gap-1">
          {(["daily", "weekly"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}
            >
              {p === "daily" ? "Today" : "Week"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No study data yet. Start studying!</div>
        ) : (
          entries.slice(0, 20).map((entry, i) => (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                entry.user_id === user?.id ? "border-primary/40 bg-primary/5" : "border-border/30 bg-card/80",
                entry.rank <= 3 && "border-yellow-500/20"
              )}
            >
              {rankIcon(entry.rank)}
              <Avatar className="w-8 h-8">
                <AvatarImage src={entry.avatar_url || ""} />
                <AvatarFallback className="text-xs">{entry.display_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {entry.display_name}
                  {entry.user_id === user?.id && <span className="text-[10px] text-primary ml-1">(You)</span>}
                </p>
              </div>
              <span className="text-sm font-bold text-primary">{formatTime(entry.total_seconds)}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardWidget;
