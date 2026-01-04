import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, Crown, Flame, Star, Sparkles } from "lucide-react";

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

      // Get user IDs sorted by total minutes - TOP 5 ONLY
      const sortedUserIds = Object.entries(userMinutes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
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
          display_name: profile?.display_name || "Anonymous Scholar",
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
        return <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />;
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
        return "bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-yellow-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/20";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 via-gray-500/10 to-gray-400/20 border-gray-400/40";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 via-orange-600/10 to-amber-600/20 border-amber-600/40";
      default:
        return "bg-secondary/30 border-border/50 hover:bg-secondary/50";
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { text: "🏆 Champion", className: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0" };
      case 2:
        return { text: "🥈 Runner Up", className: "bg-gray-400/30 text-gray-300 border-gray-400/50" };
      case 3:
        return { text: "🥉 Third Place", className: "bg-amber-600/30 text-amber-500 border-amber-600/50" };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading top learners...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-warning/5 to-background" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-warning/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-full mb-4 animate-bounce-slow">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Top 5 Students</span>
            <Flame className="w-4 h-4 text-warning" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-2">
            Study <span className="text-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">Compete with fellow scholars and climb the ranks!</p>
        </div>

        {topUsers.length === 0 ? (
          <Card className="glass-card border-border/50 max-w-md mx-auto animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-warning/50" />
              </div>
              <h3 className="font-bold text-xl mb-2">No Champions Yet!</h3>
              <p className="text-muted-foreground">Be the first to start studying and claim the top spot!</p>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warning/30" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {topUsers.map((user, index) => {
              const badge = getRankBadge(index + 1);
              return (
                <div
                  key={user.user_id}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] animate-fade-in ${getRankStyle(index + 1)}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Rank */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30' : 
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                    'bg-secondary'
                  }`}>
                    {index < 3 ? (
                      <span className="text-2xl font-black text-white">{index + 1}</span>
                    ) : (
                      getRankIcon(index + 1)
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                      index === 0 ? 'border-yellow-500' : 
                      index === 1 ? 'border-gray-400' :
                      index === 2 ? 'border-amber-600' :
                      'border-primary/30'
                    }`}>
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.display_name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">
                            {(user.display_name || "A")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1">
                        <Crown className="w-5 h-5 text-yellow-500 animate-bounce" />
                      </div>
                    )}
                  </div>

                  {/* Name & Badge */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${index === 0 ? 'text-xl text-yellow-500' : 'text-lg text-foreground'}`}>
                      {user.display_name || "Anonymous Scholar"}
                    </p>
                    {badge && (
                      <Badge className={`mt-1 text-xs ${badge.className}`}>
                        {badge.text}
                      </Badge>
                    )}
                  </div>

                  {/* Study Time */}
                  <div className="text-right">
                    <div className={`flex items-center gap-2 font-bold ${
                      index === 0 ? 'text-xl text-yellow-500' : 
                      index === 1 ? 'text-lg text-gray-400' :
                      index === 2 ? 'text-lg text-amber-500' :
                      'text-foreground'
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-500' :
                        'text-primary'
                      }`} />
                      {formatTime(user.total_minutes)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Total Study</p>
                  </div>
                </div>
              );
            })}

            {/* Motivational Footer */}
            <div className="text-center pt-6">
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Flame className="w-4 h-4 text-warning" />
                Keep studying to climb the ranks!
                <Flame className="w-4 h-4 text-warning" />
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
