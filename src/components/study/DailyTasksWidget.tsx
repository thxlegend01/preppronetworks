import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  task_date: string;
  created_at: string;
}

const DailyTasksWidget = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("daily_tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("task_date", today)
      .order("created_at", { ascending: true });
    if (data) setTasks(data);
  }, [user, today]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!user || !newTask.trim()) return;
    await (supabase as any)
      .from("daily_tasks")
      .insert({ user_id: user.id, title: newTask.trim(), task_date: today });
    setNewTask("");
    fetchTasks();
  };

  const toggleTask = async (task: Task) => {
    await (supabase as any)
      .from("daily_tasks")
      .update({ is_completed: !task.is_completed })
      .eq("id", task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await (supabase as any).from("daily_tasks").delete().eq("id", id);
    fetchTasks();
  };

  const completed = tasks.filter((t) => t.is_completed).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  if (!user)
    return (
      <div className="text-center py-12">
        <ListTodo className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Sign in to manage your daily tasks</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Today's Tasks</h3>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {completed}/{tasks.length} done
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <Progress value={progress} className="h-2.5" />
        {tasks.length > 0 && (
          <p className="text-[10px] text-muted-foreground text-right">
            {Math.round(progress)}% complete
          </p>
        )}
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task for today..."
          className="h-9 text-xs"
        />
        <Button size="sm" onClick={addTask} disabled={!newTask.trim()} className="h-9 px-3">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/80 transition-all group",
                task.is_completed && "opacity-60"
              )}
            >
              <button onClick={() => toggleTask(task)} className="flex-shrink-0">
                {task.is_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  task.is_completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <ListTodo className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

      {/* Motivation */}
      {tasks.length > 0 && completed === tasks.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4 bg-green-500/10 rounded-xl border border-green-500/20"
        >
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">All tasks done!</p>
          <p className="text-[10px] text-muted-foreground">Great work today! 💪</p>
        </motion.div>
      )}
    </div>
  );
};

export default DailyTasksWidget;
