import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Ban, ShieldCheck, Loader2, Flag, AtSign, Trash2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";

interface Profile {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
}

const UserProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [blockedByThem, setBlockedByThem] = useState(false);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url, created_at")
      .eq("username", username.toLowerCase())
      .maybeSingle();
    setProfile((data as Profile) || null);
    if (data && user) {
      const [{ data: mine }, { data: theirs }] = await Promise.all([
        supabase.from("user_blocks").select("id").eq("blocker_id", user.id).eq("blocked_id", (data as Profile).user_id).maybeSingle(),
        supabase.from("user_blocks").select("id").eq("blocker_id", (data as Profile).user_id).eq("blocked_id", user.id).maybeSingle(),
      ]);
      setBlocked(!!mine);
      setBlockedByThem(!!theirs);
    }
    setLoading(false);
  }, [username, user]);

  useEffect(() => { load(); }, [load]);

  const isMe = user?.id === profile?.user_id;

  const toggleBlock = async () => {
    if (!user || !profile) return;
    setWorking(true);
    if (blocked) {
      await supabase.from("user_blocks").delete().eq("blocker_id", user.id).eq("blocked_id", profile.user_id);
      setBlocked(false);
      toast({ title: "Unblocked" });
    } else {
      const { error } = await supabase.from("user_blocks").insert({ blocker_id: user.id, blocked_id: profile.user_id });
      if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
      else { setBlocked(true); toast({ title: "Blocked", description: `${profile.display_name || profile.username} can no longer message you.` }); }
    }
    setWorking(false);
  };

  const deleteChatForMe = async () => {
    if (!user || !profile) return;
    if (!confirm("Delete this entire chat from your inbox? This will not delete it for the other person.")) return;
    setWorking(true);
    // hide thread
    await supabase.from("dm_hidden_threads").upsert({ user_id: user.id, partner_id: profile.user_id }, { onConflict: "user_id,partner_id" });
    // mark all existing DMs as deleted_for me
    const { data: msgs } = await supabase
      .from("direct_messages")
      .select("id, deleted_for")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${profile.user_id}),and(sender_id.eq.${profile.user_id},recipient_id.eq.${user.id})`);
    for (const m of (msgs as any[]) || []) {
      const arr: string[] = m.deleted_for || [];
      if (!arr.includes(user.id)) {
        await supabase.from("direct_messages").update({ deleted_for: [...arr, user.id] as any }).eq("id", m.id);
      }
    }
    setWorking(false);
    toast({ title: "Chat deleted from your inbox" });
    navigate("/dm");
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-muted grid place-items-center"><AtSign className="w-7 h-7 text-muted-foreground" /></div>
        <h1 className="text-xl font-bold">User not found</h1>
        <p className="text-muted-foreground text-sm">No user with the username @{username}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full mt-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO title={`@${profile.username} — PrepPro Network`} description={`View ${profile.display_name || profile.username}'s PrepPro profile.`} path={`/u/${profile.username}`} />
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-30 bg-gradient-to-r from-primary/90 via-pink-500 to-fuchsia-600 shadow-lg">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/15 rounded-full h-9 w-9"><ArrowLeft className="w-5 h-5" /></Button>
            <h1 className="text-white font-black text-lg">Profile</h1>
          </div>
        </div>

        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 grid place-items-center text-white text-4xl font-black ring-4 ring-primary/20 overflow-hidden">
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : (profile.display_name || profile.username || "?")[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">{profile.display_name || profile.username}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><AtSign className="w-3.5 h-3.5" />{profile.username}</p>
            </div>

            {blockedByThem && !isMe && (
              <div className="mt-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                This user has blocked you. You cannot message them.
              </div>
            )}

            {!isMe && user && (
              <div className="mt-4 w-full grid grid-cols-1 gap-2 max-w-sm">
                <Button
                  onClick={() => navigate(`/dm/${profile.user_id}`)}
                  disabled={blocked || blockedByThem}
                  className="rounded-full h-11 gap-2 bg-primary hover:bg-primary/90"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </Button>
                <Button onClick={toggleBlock} disabled={working} variant={blocked ? "outline" : "secondary"} className="rounded-full h-11 gap-2">
                  <Ban className="w-4 h-4" /> {blocked ? "Unblock" : "Block user"}
                </Button>
                <Button onClick={deleteChatForMe} disabled={working} variant="ghost" className="rounded-full h-11 gap-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" /> Delete chat (for me)
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { navigate("/owner-chat"); toast({ title: "Report", description: "Message the owner about this user." }); }}
                  className="rounded-full h-11 gap-2 text-muted-foreground"
                >
                  <Flag className="w-4 h-4" /> Report to owner
                </Button>
              </div>
            )}

            {!user && (
              <Button onClick={() => navigate("/auth")} className="mt-4 rounded-full">Login to message</Button>
            )}

            <div className="mt-6 w-full max-w-sm rounded-2xl bg-muted/40 border border-border/50 p-4 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Safety notice</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Private chats on PrepPro may be reviewed by admins for safety & anti-abuse moderation. Never share OTPs, passwords, or personal financial info.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;