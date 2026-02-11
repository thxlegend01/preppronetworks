import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStudyTracker } from "@/hooks/useStudyTracker";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, PieChartIcon, Clock, TrendingUp } from "lucide-react";

const StatsWidget = () => {
  const { user } = useAuth();
  const tracker = useStudyTracker();

  if (!user) return null;

  const barData = tracker.stats.dailyData.map(d => ({
    name: d.date,
    hours: Math.round((d.seconds / 3600) * 10) / 10,
  }));

  const pieData = tracker.stats.subjectBreakdown.filter(s => s.seconds > 0).map(s => ({
    name: s.name,
    value: Math.round(s.seconds / 60),
    color: s.color,
  }));

  const heatmapData = tracker.stats.hourlyData;
  const maxHeatmap = Math.max(...heatmapData, 1);

  return (
    <div className="space-y-5">
      {/* Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/50 bg-card/80 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Today vs Yesterday</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-xl bg-primary/5">
            <p className="text-2xl font-black text-primary">{tracker.formatMinutes(tracker.stats.todaySeconds)}</p>
            <p className="text-[10px] text-muted-foreground">Today</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="text-2xl font-black text-muted-foreground">{tracker.formatMinutes(tracker.stats.yesterdaySeconds)}</p>
            <p className="text-[10px] text-muted-foreground">Yesterday</p>
          </div>
        </div>
        {tracker.stats.todaySeconds > tracker.stats.yesterdaySeconds && tracker.stats.yesterdaySeconds > 0 && (
          <p className="text-xs text-green-500 font-semibold text-center mt-3">
            📈 +{tracker.formatMinutes(tracker.stats.todaySeconds - tracker.stats.yesterdaySeconds)} more than yesterday!
          </p>
        )}
      </motion.div>

      {/* Weekly Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/80 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Weekly Study Time</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                formatter={(value: number) => [`${value}h`, "Study Time"]}
              />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Subject Pie Chart */}
      {pieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card/80 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold">Subject Distribution</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                  formatter={(value: number) => [`${value}m`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border/50 bg-card/80 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Peak Study Hours</h3>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {heatmapData.map((val, hour) => {
            const intensity = val / maxHeatmap;
            return (
              <div key={hour} className="text-center">
                <div
                  className="w-full aspect-square rounded-md transition-all"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${Math.max(0.08, intensity * 0.9)})`,
                  }}
                  title={`${hour}:00 - ${Math.round(val / 60)}m`}
                />
                {hour % 3 === 0 && <p className="text-[8px] text-muted-foreground mt-0.5">{hour}</p>}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] text-muted-foreground">Less</span>
          <div className="flex gap-0.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(i => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `hsl(var(--primary) / ${i})` }} />
            ))}
          </div>
          <span className="text-[9px] text-muted-foreground">More</span>
        </div>
      </motion.div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-4 text-center">
          <p className="text-2xl font-black text-primary">{tracker.formatMinutes(tracker.stats.monthSeconds)}</p>
          <p className="text-[10px] text-muted-foreground">This Month</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/80 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{tracker.stats.sessionsCount}</p>
          <p className="text-[10px] text-muted-foreground">Total Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
