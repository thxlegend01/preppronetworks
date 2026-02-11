import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useStudyTracker } from "@/hooks/useStudyTracker";
import { Play, Pause, Square, Clock, BookOpen, Flame, Target, BarChart3, Star, X, Plus, Trash2, Timer, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6"];

const StudyTimerWidget = () => {
  const { user } = useAuth();
  const tracker = useStudyTracker();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState(COLORS[0]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionRating, setSessionRating] = useState(0);
  const [sessionSubject, setSessionSubject] = useState<string | null>(null);

  if (!user) return null;

  const dailyProgress = Math.min(100, (tracker.stats.todaySeconds / 60 / tracker.goals.daily_goal_minutes) * 100);
  const weeklyProgress = Math.min(100, (tracker.stats.weekSeconds / 60 / tracker.goals.weekly_goal_minutes) * 100);

  const getPomodoroLabel = () => {
    if (tracker.mode === "normal") return null;
    const workMins = tracker.mode === "pomodoro_25_5" ? 25 : 50;
    const breakMins = tracker.mode === "pomodoro_25_5" ? 5 : 10;
    return tracker.pomodoroPhase === "work" 
      ? `Focus ${workMins}m · Round ${tracker.pomodoroCount + 1}` 
      : `Break ${breakMins}m · Round ${tracker.pomodoroCount + 1}`;
  };

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
        <div className="relative p-6 md:p-8 text-center">
          {/* Mode Selection */}
          {!tracker.isActive && (
            <div className="flex justify-center gap-2 mb-6">
              {([["normal", "Normal", Clock], ["pomodoro_25_5", "25/5", Coffee], ["pomodoro_50_10", "50/10", Zap]] as const).map(([m, label, Icon]) => (
                <button
                  key={m}
                  onClick={() => tracker.setMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                    tracker.mode === m
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Subject Selection */}
          {!tracker.isActive && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2">Select Subject</p>
              <div className="flex flex-wrap justify-center gap-2">
                {tracker.subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => tracker.setSelectedSubject(s.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      tracker.selectedSubject === s.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </button>
                ))}
                <button
                  onClick={() => setShowSubjectModal(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-border text-muted-foreground hover:border-primary/50 transition-all"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Pomodoro Phase */}
          {tracker.isActive && tracker.mode !== "normal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4",
                tracker.pomodoroPhase === "work" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-500"
              )}
            >
              {tracker.pomodoroPhase === "work" ? <Zap className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
              {getPomodoroLabel()}
            </motion.div>
          )}

          {/* Timer Display */}
          <motion.div
            className="relative inline-block"
            animate={tracker.isActive && !tracker.isPaused ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className={cn(
              "text-6xl md:text-8xl font-black tracking-tight font-mono",
              tracker.isActive && !tracker.isPaused ? "text-primary" : "text-foreground"
            )}>
              {tracker.formatTime(tracker.elapsedSeconds)}
            </div>
            {tracker.isActive && !tracker.isPaused && (
              <motion.div
                className="absolute -inset-4 rounded-full bg-primary/10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {!tracker.isActive ? (
              <Button
                onClick={tracker.startSession}
                size="lg"
                className="rounded-full px-8 gap-2 shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90"
              >
                <Play className="w-5 h-5" />
                Start Studying
              </Button>
            ) : (
              <>
                <Button
                  onClick={tracker.isPaused ? tracker.resumeSession : tracker.pauseSession}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6 gap-2"
                >
                  {tracker.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {tracker.isPaused ? "Resume" : "Pause"}
                </Button>
                <Button
                  onClick={tracker.stopSession}
                  variant="destructive"
                  size="lg"
                  className="rounded-full px-6 gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </Button>
              </>
            )}
          </div>

          {/* Selected subject indicator */}
          {tracker.isActive && tracker.selectedSubject && (
            <div className="mt-4 text-xs text-muted-foreground">
              Studying: <span className="font-semibold text-primary">{tracker.subjects.find(s => s.id === tracker.selectedSubject)?.name}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Today", value: tracker.formatMinutes(tracker.stats.todaySeconds), icon: Clock, color: "text-blue-500" },
          { label: "This Week", value: tracker.formatMinutes(tracker.stats.weekSeconds), icon: BarChart3, color: "text-green-500" },
          { label: "Streak", value: `${tracker.streak.current_streak}🔥`, icon: Flame, color: "text-orange-500" },
          { label: "Sessions", value: tracker.stats.sessionsCount.toString(), icon: BookOpen, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border/50 bg-card/80 p-4 text-center"
          >
            <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Goals Progress */}
      <div className="rounded-2xl border border-border/50 bg-card/80 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Daily Goal</h3>
          <span className="text-xs text-muted-foreground ml-auto">{Math.round(dailyProgress)}%</span>
        </div>
        <Progress value={dailyProgress} className="h-3" />
        
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold">Weekly Goal</h3>
          <span className="text-xs text-muted-foreground ml-auto">{Math.round(weeklyProgress)}%</span>
        </div>
        <Progress value={weeklyProgress} className="h-3" />

        {tracker.stats.todaySeconds > tracker.stats.yesterdaySeconds && tracker.stats.yesterdaySeconds > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-green-500 font-semibold text-center"
          >
            🎉 You studied more than yesterday! Keep it up!
          </motion.p>
        )}
      </div>

      {/* Streak Card */}
      {tracker.streak.current_streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-5 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl mb-2"
          >
            🔥
          </motion.div>
          <p className="text-2xl font-black text-orange-500">{tracker.streak.current_streak} Day Streak</p>
          <p className="text-xs text-muted-foreground mt-1">Longest: {tracker.streak.longest_streak} days</p>
        </motion.div>
      )}

      {/* Quote */}
      {tracker.quote.quote && (
        <div className="rounded-2xl border border-border/30 bg-card/50 p-5 text-center">
          <p className="text-sm italic text-muted-foreground">"{tracker.quote.quote}"</p>
          <p className="text-xs text-primary mt-2 font-semibold">— {tracker.quote.author}</p>
        </div>
      )}

      {/* Add Subject Modal */}
      <Dialog open={showSubjectModal} onOpenChange={setShowSubjectModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Subject name" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewSubjectColor(c)}
                  className={cn("w-8 h-8 rounded-full transition-all", newSubjectColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Button
              onClick={() => { tracker.addSubject(newSubjectName, newSubjectColor); setNewSubjectName(""); setShowSubjectModal(false); }}
              disabled={!newSubjectName.trim()}
              className="w-full"
            >
              Add Subject
            </Button>
          </div>

          {tracker.subjects.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Your Subjects</p>
              {tracker.subjects.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <button onClick={() => tracker.deleteSubject(s.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Complete Modal */}
      <Dialog open={tracker.showSessionModal} onOpenChange={tracker.setShowSessionModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Session Complete! 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{tracker.formatTime(tracker.elapsedSeconds)}</p>
              <p className="text-xs text-muted-foreground mt-1">Great work!</p>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">Subject</p>
              <div className="flex flex-wrap gap-2">
                {tracker.subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSessionSubject(s.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs border transition-all",
                      sessionSubject === s.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">What did you study?</p>
              <Textarea placeholder="Notes..." value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} className="text-sm" rows={3} />
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">Productivity Rating</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setSessionRating(r)}>
                    <Star className={cn("w-7 h-7 transition-all", r <= sessionRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                tracker.saveSessionDetails(sessionNotes, sessionRating, sessionSubject || tracker.selectedSubject);
                setSessionNotes("");
                setSessionRating(0);
                setSessionSubject(null);
              }}
              className="w-full"
            >
              Save Session
            </Button>
          </div>

          {tracker.quote.quote && (
            <div className="mt-4 p-3 rounded-xl bg-primary/5 text-center">
              <p className="text-xs italic text-muted-foreground">"{tracker.quote.quote}"</p>
              <p className="text-[10px] text-primary mt-1">— {tracker.quote.author}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyTimerWidget;
