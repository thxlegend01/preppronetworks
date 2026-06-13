import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, UserPlus, Eye, EyeOff, Lock, AtSign, Calendar, Ban, UserX, CheckCircle, AlertTriangle, Bell, Settings, Search, TrendingUp, Activity, RefreshCw, ChevronDown, ChevronUp, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NotificationManager from "./NotificationManager";

const ADMIN_PASSWORD = "saurabhsaroj2010@gmail.com";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface BlockedUser {
  user_id: string;
  blocked_at: string;
  reason: string | null;
}

interface UserStats {
  totalUsers: number;
  recentSignups: number;
  todaySignups: number;
  blockedUsers: number;
  activeThisWeek: number;
}

type AdminTab = "notifications" | "system" | "analytics";

const AdminSection = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    recentSignups: 0,
    todaySignups: 0,
    blockedUsers: 0,
    activeThisWeek: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const { toast } = useToast();

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: blocked, error: blockedError } = await supabase
        .from("blocked_users")
        .select("user_id, blocked_at, reason");

      if (blockedError) throw blockedError;

      const blockedIds = new Set((blocked || []).map((b: BlockedUser) => b.user_id));
      setBlockedUserIds(blockedIds);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalUsers = profiles?.length || 0;
      const todaySignups = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
      const recentSignups = profiles?.filter(p => new Date(p.created_at) >= lastWeek).length || 0;

      setStats({
        totalUsers,
        recentSignups,
        todaySignups,
        blockedUsers: blockedIds.size,
        activeThisWeek: recentSignups,
      });

      setUsers(profiles as UserProfile[] || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "system" || activeTab === "analytics") {
      fetchStats();
    }
  }, [activeTab]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.display_name?.toLowerCase().includes(q) || 
        u.username?.toLowerCase().includes(q)
      );
    }
    
    if (filterStatus === "active") {
      result = result.filter(u => !blockedUserIds.has(u.user_id));
    } else if (filterStatus === "blocked") {
      result = result.filter(u => blockedUserIds.has(u.user_id));
    }
    
    if (sortOrder === "oldest") {
      result.reverse();
    }
    
    return result;
  }, [users, searchQuery, filterStatus, sortOrder, blockedUserIds]);

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from("blocked_users")
        .insert({
          user_id: selectedUser.user_id,
          blocked_by: "admin",
          reason: blockReason || "Blocked by admin"
        });
      if (error) throw error;
      toast({ title: "User Blocked", description: `${selectedUser.display_name || selectedUser.username || "User"} has been blocked.` });
      setBlockedUserIds(prev => new Set([...prev, selectedUser.user_id]));
      setStats(prev => ({ ...prev, blockedUsers: prev.blockedUsers + 1 }));
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to block user" });
    } finally {
      setBlockDialogOpen(false);
      setSelectedUser(null);
      setBlockReason("");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const { error } = await supabase.from("blocked_users").delete().eq("user_id", userId);
      if (error) throw error;
      toast({ title: "User Unblocked", description: "User access restored." });
      setBlockedUserIds(prev => { const s = new Set(prev); s.delete(userId); return s; });
      setStats(prev => ({ ...prev, blockedUsers: prev.blockedUsers - 1 }));
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to unblock" });
    }
  };

  // --- LOCK SCREEN ---
  if (!isUnlocked) {
    return (
      <section className="py-6 px-4">
        <div className="max-w-xs mx-auto">
          <AnimatePresence>
            {!showLoginForm ? (
              <motion.div key="link" className="text-center" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  Admin Panel
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card rounded-2xl p-6 text-center border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-4">Admin Access</p>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                      className="pr-10 text-sm h-10 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {error && <p className="text-destructive text-xs">{error}</p>}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowLoginForm(false)} className="flex-1 text-xs h-9 rounded-xl">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleUnlock} className="flex-1 text-xs h-9 rounded-xl bg-primary hover:bg-primary/90">
                      <Lock className="mr-1 w-3 h-3" />
                      Unlock
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // --- DASHBOARD HOME ---
  if (!activeTab) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome, Owner</h2>
            <p className="text-muted-foreground">Manage your platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { tab: "notifications" as AdminTab, icon: Bell, title: "Notifications", desc: "Send push notifications", color: "primary" },
              { tab: "system" as AdminTab, icon: Users, title: "Users", desc: "Manage members", color: "accent" },
              { tab: "analytics" as AdminTab, icon: BarChart3, title: "Analytics", desc: "View statistics", color: "primary" },
            ].map((item, i) => (
              <motion.button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className="glass-card rounded-2xl p-6 text-center hover:border-primary/30 transition-all group border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-14 h-14 bg-${item.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 text-${item.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="sm" onClick={() => setIsUnlocked(false)} className="rounded-xl">
              <Lock className="w-3 h-3 mr-2" />
              Lock Panel
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // --- ACTIVE TAB VIEW ---
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setActiveTab(null)} className="gap-2 rounded-xl">
            ← Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsUnlocked(false)} className="rounded-xl">
            <Lock className="w-3 h-3 mr-2" />
            Lock
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-3">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Notification Center</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Send Notifications</h2>
                <p className="text-muted-foreground text-sm">Push notifications to all users</p>
              </div>
              <NotificationManager />
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-3">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Analytics</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Platform Overview</h2>
                <p className="text-muted-foreground text-sm">Key metrics and insights</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-primary", bg: "bg-primary/10" },
                      { label: "Today", value: stats.todaySignups, icon: UserPlus, color: "text-green-500", bg: "bg-green-500/10" },
                      { label: "This Week", value: stats.recentSignups, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
                      { label: "Blocked", value: stats.blockedUsers, icon: Ban, color: "text-destructive", bg: "bg-destructive/10" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="glass-card rounded-2xl p-5 border border-border/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <p className={`text-3xl font-bold ${item.color} mb-1`}>{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Growth indicator */}
                  <div className="glass-card rounded-2xl p-6 border border-border/50">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Recent Signups
                    </h3>
                    <div className="space-y-3">
                      {users.slice(0, 10).map((user, i) => (
                        <motion.div 
                          key={user.id}
                          className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">
                                {(user.display_name || "U")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.display_name || "Anonymous"}</p>
                              {user.username && <p className="text-xs text-muted-foreground">@{user.username}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* SYSTEM/USERS TAB */}
          {activeTab === "system" && (
            <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent mb-3">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">User Management</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">All Users</h2>
                <p className="text-muted-foreground text-sm">{stats.totalUsers} registered members</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total", value: stats.totalUsers, color: "text-primary" },
                  { label: "Today", value: stats.todaySignups, color: "text-green-500" },
                  { label: "Week", value: stats.recentSignups, color: "text-blue-500" },
                  { label: "Blocked", value: stats.blockedUsers, color: "text-destructive" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-xl p-3 text-center border border-border/50">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl h-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                    className="h-10 rounded-xl gap-1"
                  >
                    {sortOrder === "newest" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    {sortOrder === "newest" ? "Newest" : "Oldest"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={fetchStats} className="h-10 rounded-xl">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Users List */}
              <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {filteredUsers.map((user, index) => {
                      const isBlocked = blockedUserIds.has(user.user_id);
                      return (
                        <motion.div
                          key={user.id}
                          className={`flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors ${isBlocked ? 'bg-destructive/5' : ''}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-xs text-muted-foreground w-6 text-right flex-shrink-0">{index + 1}</div>
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt="" 
                                className={`w-9 h-9 rounded-lg object-cover flex-shrink-0 ${isBlocked ? 'opacity-50 grayscale' : ''}`}
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isBlocked ? 'bg-destructive/10' : 'bg-gradient-to-br from-primary/20 to-accent/20'}`}>
                                <span className={`text-xs font-bold ${isBlocked ? 'text-destructive' : 'text-primary'}`}>
                                  {(user.display_name || "U")[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${isBlocked ? 'line-through text-muted-foreground' : ''}`}>
                                {user.display_name || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2">
                                {user.username && (
                                  <span className="text-xs text-muted-foreground">@{user.username}</span>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(user.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isBlocked ? (
                              <>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 text-destructive rounded-md text-[10px]">
                                  <UserX className="w-2.5 h-2.5" />
                                  Blocked
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-500 border-green-500/30 hover:bg-green-500/10 h-8 text-xs rounded-lg"
                                  onClick={() => handleUnblockUser(user.user_id)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Unblock
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md text-[10px]">
                                  <CheckCircle className="w-2.5 h-2.5" />
                                  Active
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8 text-xs rounded-lg"
                                  onClick={() => { setSelectedUser(user); setBlockDialogOpen(true); }}
                                >
                                  <Ban className="w-3 h-3 mr-1" />
                                  Block
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No users found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Block Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Block User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Block <strong>{selectedUser?.display_name || selectedUser?.username || "this user"}</strong>? They won't be able to access the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <Input
              placeholder="Reason (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSelectedUser(null); setBlockReason(""); }} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              onClick={handleBlockUser}
            >
              <Ban className="w-4 h-4 mr-2" />
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AdminSection;
