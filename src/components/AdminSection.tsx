import { useState, useEffect } from "react";
import { Shield, Users, UserPlus, Eye, EyeOff, Lock, AtSign, Calendar, Clock, Ban, UserX, CheckCircle, AlertTriangle } from "lucide-react";
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

const ADMIN_PASSWORD = "Legend Owner";

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
}

const AdminSection = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    recentSignups: 0,
    todaySignups: 0,
    blockedUsers: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const { toast } = useToast();

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setError("");
      fetchStats();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get blocked users
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
      });

      setUsers(profiles as UserProfile[] || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

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

      toast({
        title: "User Blocked",
        description: `${selectedUser.display_name || selectedUser.username || "User"} has been restricted from the site.`,
      });

      setBlockedUserIds(prev => new Set([...prev, selectedUser.user_id]));
      setStats(prev => ({ ...prev, blockedUsers: prev.blockedUsers + 1 }));
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to block user",
      });
    } finally {
      setBlockDialogOpen(false);
      setSelectedUser(null);
      setBlockReason("");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "User Unblocked",
        description: "User access has been restored.",
      });

      setBlockedUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      setStats(prev => ({ ...prev, blockedUsers: prev.blockedUsers - 1 }));
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to unblock user",
      });
    }
  };

  const openBlockDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  if (!isUnlocked) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Admin Access</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Enter the admin password to view statistics
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              
              <Button onClick={handleUnlock} className="w-full">
                <Shield className="mr-2 w-4 h-4" />
                Unlock Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            User Management
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage users and restrict access to the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">{stats.totalUsers}</p>
            <p className="text-muted-foreground">Total Users</p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-4xl font-bold text-green-500 mb-2">{stats.todaySignups}</p>
            <p className="text-muted-foreground">Today's Signups</p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <p className="text-4xl font-bold text-accent mb-2">{stats.recentSignups}</p>
            <p className="text-muted-foreground">Last 7 Days</p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-4xl font-bold text-destructive mb-2">{stats.blockedUsers}</p>
            <p className="text-muted-foreground">Blocked Users</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">All Registered Users</h3>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              Refresh
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Username</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const isBlocked = blockedUserIds.has(user.user_id);
                    return (
                      <tr key={user.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${isBlocked ? 'bg-destructive/5' : ''}`}>
                        <td className="py-3 px-4 text-sm font-medium">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.display_name || "User"} 
                                className={`w-10 h-10 rounded-full object-cover ring-2 ${isBlocked ? 'ring-destructive/50 opacity-50' : 'ring-primary/20'}`}
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBlocked ? 'bg-destructive/20' : 'bg-gradient-to-br from-primary/30 to-accent/30'}`}>
                                <span className={`text-sm font-bold ${isBlocked ? 'text-destructive' : 'text-primary'}`}>
                                  {(user.display_name || "U")[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className={`font-medium block ${isBlocked ? 'line-through text-muted-foreground' : ''}`}>
                                {user.display_name || "Anonymous"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {user.username ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                              <AtSign className="w-3 h-3" />
                              {user.username}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm italic">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-sm">
                              <UserX className="w-3 h-3" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-sm">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                              onClick={() => handleUnblockUser(user.user_id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => openBlockDialog(user)}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Block
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No users found</p>
              )}
            </div>
          )}
        </div>

        {/* Notification Manager */}
        <NotificationManager />

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setIsUnlocked(false)}
          >
            Lock Admin Panel
          </Button>
        </div>
      </div>

      {/* Block User Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Block User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block <strong>{selectedUser?.display_name || selectedUser?.username || "this user"}</strong>? 
              They will be restricted from accessing the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Reason for blocking (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedUser(null);
              setBlockReason("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBlockUser}
            >
              <Ban className="w-4 h-4 mr-2" />
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AdminSection;
