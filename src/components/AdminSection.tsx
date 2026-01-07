import { useState, useEffect } from "react";
import { Shield, Users, UserPlus, Eye, EyeOff, Lock, Mail, AtSign, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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

interface UserStats {
  totalUsers: number;
  recentSignups: number;
  todaySignups: number;
  usersWithUsername: number;
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
    usersWithUsername: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

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
      // Get all profiles (represents all users)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalUsers = profiles?.length || 0;
      const todaySignups = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
      const recentSignups = profiles?.filter(p => new Date(p.created_at) >= lastWeek).length || 0;
      const usersWithUsername = profiles?.filter(p => p.username).length || 0;

      setStats({
        totalUsers,
        recentSignups,
        todaySignups,
        usersWithUsername,
      });

      setUsers(profiles as UserProfile[] || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
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
            User Statistics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Overview of all registered users and signup activity
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
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AtSign className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-4xl font-bold text-blue-500 mb-2">{stats.usersWithUsername}</p>
            <p className="text-muted-foreground">With Username</p>
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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">User ID</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.display_name || "User"} 
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {(user.display_name || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium block">{user.display_name || "Anonymous"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.username ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm text-primary">
                            <AtSign className="w-3 h-3" />
                            {user.username}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm italic">Not set</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {user.user_id?.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(user.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No users found</p>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setIsUnlocked(false)}
          >
            Lock Admin Panel
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdminSection;
