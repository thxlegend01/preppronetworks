import { useAuth } from "@/hooks/useAuth";
import { useStudyTimer } from "@/hooks/useStudyTimer";
import { useDbFavorites } from "@/hooks/useDbFavorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Play, 
  Pause, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Heart,
  BookOpen,
  Target,
  Flame
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    isActive, 
    elapsedSeconds, 
    stats, 
    startSession, 
    stopSession, 
    formatTime, 
    formatMinutes 
  } = useStudyTimer();
  const { favorites } = useDbFavorites();

  if (!user) return null;

  const dailyGoal = 120; // 2 hours daily goal
  const dailyProgress = Math.min((stats.todayMinutes / dailyGoal) * 100, 100);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Progress</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Study <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-muted-foreground">Track your preparation journey</p>
        </div>

        {/* Timer Card - Full Width */}
        <Card className="mb-8 glass-card border-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Flame className="w-4 h-4 text-warning" />
                  Current Session
                </p>
                <div className="text-5xl md:text-6xl font-mono font-bold text-foreground tracking-wider">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={isActive ? stopSession : startSession}
                className={`h-16 px-8 text-lg font-semibold transition-all ${
                  isActive 
                    ? "bg-destructive hover:bg-destructive/90" 
                    : "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-6 h-6 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Start Studying
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Today</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatMinutes(stats.todayMinutes)}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">This Week</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatMinutes(stats.weekMinutes)}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatMinutes(stats.totalMinutes)}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-warning" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Sessions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.sessionsCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Goal Progress */}
        <Card className="glass-card border-border/50 mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Daily Goal
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {formatMinutes(stats.todayMinutes)} / {formatMinutes(dailyGoal)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={dailyProgress} className="h-3" />
            {dailyProgress >= 100 && (
              <p className="text-sm text-success mt-2 flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Goal achieved! Great work! 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saved Favorites</p>
                    <p className="text-xl font-bold text-foreground">{favorites.length} items</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Daily Study</p>
                    <p className="text-xl font-bold text-foreground">
                      {stats.sessionsCount > 0 
                        ? formatMinutes(Math.round(stats.totalMinutes / Math.max(stats.sessionsCount, 1)))
                        : "0m"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;