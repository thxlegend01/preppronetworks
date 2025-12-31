import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, Crown } from "lucide-react";

interface LeaderboardUser {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_minutes: number;
}

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Get study sessions grouped by user
      const { data: sessions, error: sessionsError } = await supabase
        .from("user_study_sessions")
        .select("user_id, duration_minutes");

      if (sessionsError) throw sessionsError;

      // Aggregate total minutes per user
      const userMinutes: Record<string, number> = {};
      sessions?.forEach((session) => {
        if (session.duration_minutes) {
          userMinutes[session.user_id] = (userMinutes[session.user_id] || 0) + session.duration_minutes;
        }
      });

      // Get user IDs sorted by total minutes
      const sortedUserIds = Object.entries(userMinutes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([userId]) => userId);

      if (sortedUserIds.length === 0) {
        setTopUsers([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", sortedUserIds);

      if (profilesError) throw profilesError;

      // Combine data
      const leaderboard: LeaderboardUser[] = sortedUserIds.map((userId) => {
        const profile = profiles?.find((p) => p.user_id === userId);
        return {
          user_id: userId,
          display_name: profile?.display_name || "Anonymous User",
          avatar_url: profile?.avatar_url,
          total_minutes: userMinutes[userId],
        };
      });

      setTopUsers(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "bg-secondary/30 border-border/50";
    }
  };

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-background" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-warning/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Leaderboard</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Top <span className="text-gradient">Learners</span>
          </h2>
          <p className="text-muted-foreground">See who's leading in study hours!</p>
        </div>

        {topUsers.length === 0 ? (
          <Card className="glass-card border-border/50 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No study sessions yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to start studying and top the leaderboard!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-3">
            {topUsers.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankStyle(
                  index + 1
                )}`}
              >
                {/* Rank */}
                <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.display_name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {(user.display_name || "A")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {user.display_name || "Anonymous User"}
                  </p>
                  {index < 3 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        index === 0
                          ? "bg-yellow-500/20 text-yellow-600"
                          : index === 1
                          ? "bg-gray-400/20 text-gray-500"
                          : "bg-amber-600/20 text-amber-600"
                      }`}
                    >
                      {index === 0 ? "Champion" : index === 1 ? "Runner Up" : "Third Place"}
                    </Badge>
                  )}
                </div>

                {/* Study Time */}
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-foreground font-bold">
                    <Clock className="w-4 h-4 text-primary" />
                    {formatTime(user.total_minutes)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
