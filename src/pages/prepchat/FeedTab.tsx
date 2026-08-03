import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Send, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfiles, initialsOf, nameOf, ProfileLite, timeAgo } from "@/lib/prepchat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Stories from "@/components/prepchat/Stories";

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  subject_tag: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const FeedTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [likes, setLikes] = useState<Record<string, string[]>>({});
  const [saves, setSaves] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: p } = await supabase
      .from("prepchat_posts")
      .select("id, author_id, content, image_url, subject_tag, created_at")
      .order("created_at", { ascending: false })
      .limit(60);
    const list = (p as Post[]) || [];
    setPosts(list);
    setProfiles(await fetchProfiles(list.map((x) => x.author_id)));

    const ids = list.map((x) => x.id);
    if (ids.length) {
      const [{ data: r }, { data: c }, { data: s }] = await Promise.all([
        supabase.from("prepchat_likes").select("post_id, user_id").in("post_id", ids),
        supabase.from("prepchat_comments").select("id, post_id, user_id, content, created_at").in("post_id", ids).order("created_at"),
        user ? supabase.from("prepchat_saves").select("post_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { post_id: string }[] }),
      ]);
      const lk: Record<string, string[]> = {};
      (r || []).forEach((x) => { (lk[x.post_id] ||= []).push(x.user_id); });
      setLikes(lk);
      const cm: Record<string, Comment[]> = {};
      (c as Comment[] || []).forEach((x) => { (cm[x.post_id] ||= []).push(x); });
      setComments(cm);
      setSaves(new Set(((s as { post_id: string }[]) || []).map((x) => x.post_id)));
      const commenters = (c as Comment[] || []).map((x) => x.user_id);
      const extra = await fetchProfiles(commenters);
      setProfiles((prev) => ({ ...extra, ...prev }));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("prepchat-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "prepchat_posts" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "prepchat_likes" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const liked = (likes[postId] || []).includes(user.id);
    setLikes((prev) => ({
      ...prev,
      [postId]: liked ? (prev[postId] || []).filter((u) => u !== user.id) : [...(prev[postId] || []), user.id],
    }));
    if (liked) {
      await supabase.from("prepchat_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("prepchat_likes").insert({ post_id: postId, user_id: user.id });
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;
    const saved = saves.has(postId);
    setSaves((prev) => {
      const n = new Set(prev);
      saved ? n.delete(postId) : n.add(postId);
      return n;
    });
    if (saved) await supabase.from("prepchat_saves").delete().eq("post_id", postId).eq("user_id", user.id);
    else await supabase.from("prepchat_saves").insert({ post_id: postId, user_id: user.id });
  };

  const addComment = async (postId: string) => {
    if (!user || !draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    const { error } = await supabase.from("prepchat_comments").insert({ post_id: postId, user_id: user.id, content: text });
    if (error) return toast.error("Could not post comment");
    load();
  };

  const goProfile = (id: string) => {
    const p = profiles[id];
    navigate(p?.username ? `/prepchat/u/${p.username}` : `/prepchat/chats`);
  };

  if (loading) {
    return (
      <>
        <Stories />
        <div className="py-20 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </>
    );
  }

  if (!posts.length) {
    return (
      <>
        <Stories />
        <div className="py-24 text-center text-muted-foreground px-6">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-foreground">No doubts posted yet</p>
          <p className="text-sm mt-1">Be the first — tap the Post tab and share a doubt.</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <Stories />
      <div className="divide-y divide-border border-t border-border">
      {posts.map((post, i) => {
        const author = profiles[post.author_id];
        const liked = !!user && (likes[post.id] || []).includes(user.id);
        const postComments = comments[post.id] || [];
        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
            className="py-3"
          >
            <div className="flex items-center gap-3 px-4">
              <button onClick={() => goProfile(post.author_id)} className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white text-sm font-bold shrink-0">
                {author?.avatar_url ? <img src={author.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(author)}
              </button>
              <button onClick={() => goProfile(post.author_id)} className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold truncate">{nameOf(author)}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)}</p>
              </button>
              {post.subject_tag && (
                <span className="text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {post.subject_tag}
                </span>
              )}
            </div>

            {post.image_url && (
              <div className="mt-3 bg-muted">
                <img src={post.image_url} alt={post.content?.slice(0, 60) || "Doubt"} loading="lazy" className="w-full max-h-[70vh] object-contain" />
              </div>
            )}

            <div className="flex items-center gap-4 px-4 pt-3">
              <button onClick={() => toggleLike(post.id)} className="active:scale-90 transition">
                <Heart className={cn("w-6 h-6", liked ? "fill-primary text-primary" : "text-foreground")} />
              </button>
              <button onClick={() => setOpenComments(openComments === post.id ? null : post.id)} className="active:scale-90 transition">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/prepchat/feed`); toast.success("Link copied"); }}
                className="active:scale-90 transition"
              >
                <Send className="w-6 h-6" />
              </button>
              <button onClick={() => toggleSave(post.id)} className="ml-auto active:scale-90 transition">
                <Bookmark className={cn("w-6 h-6", saves.has(post.id) && "fill-foreground")} />
              </button>
            </div>

            <div className="px-4 pt-2">
              <p className="text-sm font-bold">{(likes[post.id] || []).length} likes</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">
                <span className="font-bold mr-1.5">{author?.username ? `@${author.username}` : nameOf(author)}</span>
                {post.content}
              </p>
              {postComments.length > 0 && (
                <button onClick={() => setOpenComments(openComments === post.id ? null : post.id)} className="text-xs text-muted-foreground mt-1">
                  View all {postComments.length} comments
                </button>
              )}
            </div>

            {openComments === post.id && (
              <div className="px-4 pt-3 space-y-2">
                {postComments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted grid place-items-center text-[10px] font-bold shrink-0 overflow-hidden">
                      {profiles[c.user_id]?.avatar_url
                        ? <img src={profiles[c.user_id]!.avatar_url!} alt="" className="w-full h-full object-cover" />
                        : initialsOf(profiles[c.user_id])}
                    </div>
                    <p className="text-xs leading-relaxed">
                      <span className="font-bold mr-1">{profiles[c.user_id]?.username ? `@${profiles[c.user_id]!.username}` : nameOf(profiles[c.user_id])}</span>
                      {c.content}
                    </p>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                    placeholder="Add a comment…"
                    className="h-9 rounded-full"
                  />
                  <Button size="sm" className="rounded-full" onClick={() => addComment(post.id)} disabled={!draft.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            )}
          </motion.article>
        );
      })}
      </div>
    </div>
  );
};

export default FeedTab;