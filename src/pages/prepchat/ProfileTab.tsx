import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, MessageCircle, LogOut, Grid3X3, Ban, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProfileLite, getOrCreateDm, initialsOf, nameOf } from "@/lib/prepchat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Post { id: string; content: string; image_url: string | null; subject_tag: string | null; created_at: string; }

const ProfileTab = () => {
  const { username } = useParams<{ username: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listMode, setListMode] = useState<null | "followers" | "following">(null);
  const [listUsers, setListUsers] = useState<ProfileLite[] | null>(null);

  const isMe = !username || (!!profile && profile.user_id === user?.id);

  const load = useCallback(async () => {
    setLoading(true);
    let prof: ProfileLite | null = null;
    if (username) {
      const { data } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").eq("username", username).maybeSingle();
      prof = (data as ProfileLite) || null;
    } else if (user) {
      const { data } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").eq("user_id", user.id).maybeSingle();
      prof = (data as ProfileLite) || null;
    }
    setProfile(prof);
    if (!prof) { setLoading(false); return; }

    const [{ data: p }, { count: followers }, { count: following }, { data: fol }, { data: blk }] = await Promise.all([
      supabase.from("prepchat_posts").select("id, content, image_url, subject_tag, created_at").eq("author_id", prof.user_id).order("created_at", { ascending: false }).limit(60),
      supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("following_id", prof.user_id),
      supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("follower_id", prof.user_id),
      user ? supabase.from("user_follows").select("id").eq("follower_id", user.id).eq("following_id", prof.user_id).maybeSingle() : Promise.resolve({ data: null }),
      user ? supabase.from("user_blocks").select("id").eq("blocker_id", user.id).eq("blocked_id", prof.user_id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    setPosts((p as Post[]) || []);
    setCounts({ followers: followers || 0, following: following || 0 });
    setIsFollowing(!!fol);
    setIsBlocked(!!blk);
    setLoading(false);
  }, [username, user]);

  useEffect(() => { load(); }, [load]);

  const toggleFollow = async () => {
    if (!user || !profile) return;
    if (isFollowing) {
      await supabase.from("user_follows").delete().eq("follower_id", user.id).eq("following_id", profile.user_id);
    } else {
      await supabase.from("user_follows").insert({ follower_id: user.id, following_id: profile.user_id });
    }
    load();
  };

  const toggleBlock = async () => {
    if (!user || !profile) return;
    if (isBlocked) {
      await supabase.from("user_blocks").delete().eq("blocker_id", user.id).eq("blocked_id", profile.user_id);
      toast.success("Unblocked");
    } else {
      await supabase.from("user_blocks").insert({ blocker_id: user.id, blocked_id: profile.user_id });
      toast.success("Blocked");
    }
    load();
  };

  const openList = async (mode: "followers" | "following") => {
    if (!profile) return;
    setListMode(mode);
    setListUsers(null);
    const col = mode === "followers" ? "following_id" : "follower_id";
    const other = mode === "followers" ? "follower_id" : "following_id";
    const { data } = await supabase.from("user_follows").select(other).eq(col, profile.user_id).limit(300);
    const ids = ((data as Record<string, string>[]) || []).map((r) => r[other]);
    if (!ids.length) { setListUsers([]); return; }
    const { data: profs } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").in("user_id", ids);
    setListUsers((profs as ProfileLite[]) || []);
  };

  const message = async () => {
    if (!user || !profile) return;
    const id = await getOrCreateDm(user.id, profile.user_id);
    if (!id) return toast.error("Could not start chat");
    navigate(`/prepchat/chats/${id}`);
  };

  if (loading) return <div className="py-20 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!profile) return <div className="py-20 text-center text-muted-foreground text-sm">Profile not found.</div>;

  return (
    <div className="p-4 space-y-5">
      {username && (
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white text-2xl font-black shrink-0">
          {profile.avatar_url ? <img src={profile.avatar_url} alt={nameOf(profile)} className="w-full h-full object-cover" /> : initialsOf(profile)}
        </div>
        <div className="flex-1 grid grid-cols-3 text-center">
          <div>
            <p className="font-black text-lg">{posts.length}</p>
            <p className="text-[11px] text-muted-foreground">Posts</p>
          </div>
          <button onClick={() => openList("followers")}>
            <p className="font-black text-lg">{counts.followers}</p>
            <p className="text-[11px] text-muted-foreground">Followers</p>
          </button>
          <button onClick={() => openList("following")}>
            <p className="font-black text-lg">{counts.following}</p>
            <p className="text-[11px] text-muted-foreground">Following</p>
          </button>
        </div>
      </div>

      <div>
        <p className="font-black text-lg">{nameOf(profile)}</p>
        {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
      </div>

      {isMe ? (
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 rounded-xl font-bold" onClick={() => navigate("/profile")}>Edit profile</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => signOut()}><LogOut className="w-4 h-4" /></Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button className="flex-1 rounded-xl font-bold" variant={isFollowing ? "secondary" : "default"} onClick={toggleFollow}>
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="secondary" className="flex-1 rounded-xl font-bold gap-2" onClick={message}>
            <MessageCircle className="w-4 h-4" /> Message
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={toggleBlock} title={isBlocked ? "Unblock" : "Block"}>
            <Ban className={isBlocked ? "w-4 h-4 text-destructive" : "w-4 h-4"} />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground pt-2 border-t border-border">
        <Grid3X3 className="w-4 h-4" /> Doubts
      </div>

      <Dialog open={!!listMode} onOpenChange={(o) => !o && setListMode(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="capitalize">{listMode}</DialogTitle></DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {!listUsers && <div className="py-8 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}
            {listUsers?.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Nobody yet.</p>}
            {listUsers?.map((u) => (
              <button
                key={u.user_id}
                onClick={() => { setListMode(null); if (u.username) navigate(`/prepchat/u/${u.username}`); }}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted text-left"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white text-xs font-bold shrink-0">
                  {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(u)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{nameOf(u)}</p>
                  {u.username && <p className="text-xs text-muted-foreground truncate">@{u.username}</p>}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {posts.length ? (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate("/prepchat/feed")}
              className="aspect-square rounded-lg overflow-hidden bg-muted text-left"
            >
              {p.image_url
                ? <img src={p.image_url} alt={p.content.slice(0, 60)} className="w-full h-full object-cover" loading="lazy" />
                : <span className="block p-2 text-[10px] text-muted-foreground line-clamp-5">{p.content}</span>}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">No doubts posted yet.</p>
      )}
    </div>
  );
};

export default ProfileTab;