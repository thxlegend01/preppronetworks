import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePresence } from "@/hooks/usePresence";
import Header from "@/components/Header";

import PageTransition from "@/components/PageTransition";
import StudyTimerWidget from "@/components/study/StudyTimerWidget";
import StatsWidget from "@/components/study/StatsWidget";
import StudyRoomsWidget from "@/components/study/StudyRoomsWidget";
import LeaderboardWidget from "@/components/study/LeaderboardWidget";
import FriendsWidget from "@/components/study/FriendsWidget";
import DailyTasksWidget from "@/components/study/DailyTasksWidget";
import { Timer, BarChart3, Users, Trophy, UserPlus, Circle, ArrowLeft, LogIn, X, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "timer", label: "Timer", icon: Timer },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "rooms", label: "Rooms", icon: Users },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "leaderboard", label: "Rank", icon: Trophy },
  { id: "friends", label: "Friends", icon: UserPlus },
] as const;

type TabId = typeof tabs[number]["id"];

const StudyTrackerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { liveStats } = usePresence();
  const [activeTab, setActiveTab] = useState<TabId>("timer");
  const [showLoginBanner, setShowLoginBanner] = useState(true);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 pt-20 pb-28 max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black">Study Tracker</h1>
                <p className="text-[10px] text-muted-foreground">YPT Style · PrepPro Network</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                {liveStats.online} online
              </span>
              <span className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                {liveStats.studying} studying
              </span>
            </div>
          </motion.div>

          {/* Login prompt for non-logged-in users */}
          {!user && showLoginBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3"
            >
              <LogIn className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-foreground flex-1">
                <span className="font-semibold">Sign in</span> to save progress, compete on leaderboards & join rooms
              </p>
              <Button
                size="sm"
                variant="hero"
                className="text-xs px-3 py-1 h-7 flex-shrink-0"
                onClick={() => navigate("/auth")}
              >
                Login
              </Button>
              <button onClick={() => setShowLoginBanner(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "timer" && <StudyTimerWidget />}
              {activeTab === "stats" && <StatsWidget />}
              {activeTab === "rooms" && <StudyRoomsWidget />}
              {activeTab === "tasks" && <DailyTasksWidget />}
              {activeTab === "leaderboard" && <LeaderboardWidget />}
              {activeTab === "friends" && <FriendsWidget />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-lg mx-auto">
            <div className="mx-3 mb-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl shadow-black/10">
              <div className="flex items-center justify-around py-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all",
                      activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <motion.div
                      animate={activeTab === tab.id ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <tab.icon className={cn("w-5 h-5", activeTab === tab.id && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
                    </motion.div>
                    <span className="text-[8px] font-semibold">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-indicator" className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudyTrackerPage;
