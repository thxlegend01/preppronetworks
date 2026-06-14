import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Send, MessageSquare, Trash2, Ban, X, Loader2, Plus, LogIn, Megaphone, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import prepproLogo from "@/assets/preppro-logo.jpg";

const ADMIN_EMAILS = [
  "thxlegend01era@gmail.com",
  "saurabhsaroj2010@gmail.com",
  "manojadeviaw@gmail.com",
  "saurabh20103060@gmail.com",
];

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "🚀", "👏", "💯", "🎉"];

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  is_edited: boolean;
}
interface Reaction { id: string; post_id: string; user_id: string; emoji: string; }
interface Comment { id: string; post_id: string; user_id: string; content: string; created_at: string; }
interface Profile { user_id: string; display_name: string | null; username: string | null; avatar_url: string | null; }

const CommunityPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [bannedIds, setBannedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftImage, setDraftImage] = useState("");
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editImage, setEditImage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAll = useCallback(async () => {
    const [{ data: p }, { data: r }, { data: c }, { data: b }] = await Promise.all([
      supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("community_reactions").select("*"),
      supabase.from("community_comments").select("*").order("created_at", { ascending: true }),
      supabase.from("community_banned_users").select("user_id"),
    ]);
    setPosts((p || []) as Post[]);
    setReactions((r || []) as Reaction[]);
    setComments((c || []) as Comment[]);
    setBannedIds(new Set((b || []).map((x: any) => x.user_id)));

    const ids = new Set<string>();
    (p || []).forEach((x: any) => ids.add(x.author_id));
    (c || []).forEach((x: any) => ids.add(x.user_id));
    if (ids.size) {
      const { data: pr } = await supabase.from("profiles").select("user_id, display_name, username, avatar_url").in("user_id", Array.from(ids));
      const map: Record<string, Profile> = {};
      (pr || []).forEach((x: any) => { map[x.user_id] = x; });
      setProfiles(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchAll();
    const ch = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_reactions" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_comments" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, fetchAll]);

  const iAmBanned = user ? bannedIds.has(user.id) : false;

  const submitPost = async () => {
    if (!user || !isAdmin || !draft.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({
      author_id: user.id,
      content: draft.trim(),
      image_url: draftImage.trim() || null,
    });
    setPosting(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setDraft(""); setDraftImage(""); setComposerOpen(false);
    toast({ title: "Posted to Community" });
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
  };

  const startEdit = (p: Post) => {
    setEditingPostId(p.id);
    setEditDraft(p.content);
    setEditImage(p.image_url || "");
  };
  const cancelEdit = () => { setEditingPostId(null); setEditDraft(""); setEditImage(""); };
  const saveEdit = async (id: string) => {
    if (!editDraft.trim()) return;
    setSavingEdit(true);
    const { error } = await supabase.from("community_posts").update({
      content: editDraft.trim(),
      image_url: editImage.trim() || null,
      is_edited: true,
    }).eq("id", id);
    setSavingEdit(false);
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    cancelEdit();
    toast({ title: "Post updated" });
  };

  const toggleReaction = async (postId: string, emoji: string) => {
    if (!user || iAmBanned) return;
    const mine = reactions.find(r => r.post_id === postId && r.user_id === user.id && r.emoji === emoji);
    if (mine) {
      await supabase.from("community_reactions").delete().eq("id", mine.id);
    } else {
      await supabase.from("community_reactions").insert({ post_id: postId, user_id: user.id, emoji });
    }
  };

  const addComment = async (postId: string) => {
    if (!user || iAmBanned) return;
    const text = (commentDraft[postId] || "").trim();
    if (!text) return;
    const { error } = await supabase.from("community_comments").insert({ post_id: postId, user_id: user.id, content: text });
    if (error) { toast({ variant: "destructive", title: "Failed", description: error.message }); return; }
    setCommentDraft(d => ({ ...d, [postId]: "" }));
  };

  const deleteComment = async (id: string) => {
    await supabase.from("community_comments").delete().eq("id", id);
  };

  const banUser = async (uid: string) => {
    if (!isAdmin) return;
    if (!confirm("Ban this user from posting reactions/comments?")) return;
    await supabase.from("community_banned_users").insert({ user_id: uid, banned_by: user!.id, reason: "Banned by admin" });
    toast({ title: "User banned" });
  };
  const unbanUser = async (uid: string) => {
    await supabase.from("community_banned_users").delete().eq("user_id", uid);
    toast({ title: "User unbanned" });
  };

  const reactionsByPost = useMemo(() => {
    const m: Record<string, Record<string, { count: number; mine: boolean }>> = {};
    reactions.forEach(r => {
      m[r.post_id] = m[r.post_id] || {};
      m[r.post_id][r.emoji] = m[r.post_id][r.emoji] || { count: 0, mine: false };
      m[r.post_id][r.emoji].count += 1;
      if (user && r.user_id === user.id) m[r.post_id][r.emoji].mine = true;
    });
    return m;
  }, [reactions, user]);

  const commentsByPost = useMemo(() => {
    const m: Record<string, Comment[]> = {};
    comments.forEach(c => { (m[c.post_id] = m[c.post_id] || []).push(c); });
    return m;
  }, [comments]);

  if (authLoading || loading) {
    return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><MessageSquare className="w-10 h-10 text-primary" /></div>
        <h1 className="text-2xl font-bold">Open Community</h1>
        <p className="text-muted-foreground max-w-md">Login to view announcements, react and comment.</p>
        <Button onClick={() => navigate("/auth")} className="gap-2"><LogIn className="w-4 h-4" /> Login</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO title="Open Community — PrepPro Network" description="Official PrepPro Network community feed with announcements, reactions and comments." path="/community" />
      <div className="min-h-screen bg-background pb-24">
        {/* Header strip — Telegram-channel style */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#db2777] shadow-lg">
          <div className="container mx-auto max-w-2xl px-3 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/15 rounded-full h-9 w-9 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/70 bg-white">
                <img src={prepproLogo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-white text-lg leading-none truncate">PrepPro Official</h1>
                <span className="inline-block w-4 h-4 rounded-full bg-sky-300 text-[10px] font-black text-sky-900 grid place-items-center">✓</span>
              </div>
              <p className="text-[11px] text-white/85 mt-0.5">Open Community Channel</p>
            </div>
            {isAdmin && (
              <Button onClick={() => setComposerOpen(v => !v)} className="rounded-full bg-white text-foreground hover:bg-white/90 h-9 px-3 gap-1.5 font-bold shrink-0">
                <Plus className="w-4 h-4" /> Post
              </Button>
            )}
          </div>
        </div>

        {/* Composer */}
        <AnimatePresence>
          {isAdmin && composerOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b border-border/60 bg-card">
              <div className="container mx-auto max-w-2xl p-3 space-y-2">
                <Textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write an announcement…" className="min-h-24 rounded-2xl" />
                <Input value={draftImage} onChange={e => setDraftImage(e.target.value)} placeholder="Image URL (optional)" className="rounded-xl text-sm" />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => { setComposerOpen(false); setDraft(""); setDraftImage(""); }} className="rounded-full">Cancel</Button>
                  <Button onClick={submitPost} disabled={posting || !draft.trim()} className="rounded-full gap-1.5">
                    {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publish
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed */}
        <div className="container mx-auto max-w-2xl px-3 py-4 space-y-3">
          {posts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Megaphone /> <p className="mt-3 text-sm">No announcements yet. Stay tuned!</p>
            </div>
          )}
          {posts.map((post, idx) => {
            const author = profiles[post.author_id];
            const reacts = reactionsByPost[post.id] || {};
            const postComments = commentsByPost[post.id] || [];
            const open = openComments[post.id];
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 5) * 0.04 }}
                className="rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden"
              >
                {/* author row */}
                <div className="flex items-center gap-2.5 p-3 pb-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 ring-1 ring-border shrink-0 grid place-items-center text-white text-sm font-bold">
                    {author?.avatar_url ? <img src={author.avatar_url} alt="" className="w-full h-full object-cover" /> : <img src={prepproLogo} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">{author?.display_name || "PrepPro Admin"}</p>
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-sky-500 text-[9px] font-black text-white grid place-items-center">✓</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{new Date(post.created_at).toLocaleString()}{post.is_edited && " · edited"}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(post)} className="h-8 w-8 text-foreground hover:bg-muted rounded-full" aria-label="Edit post">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deletePost(post.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full" aria-label="Delete post">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* content */}
                <div className="px-4 pb-3">
                  {editingPostId === post.id ? (
                    <div className="space-y-2">
                      <Textarea value={editDraft} onChange={e => setEditDraft(e.target.value)} className="min-h-24 rounded-2xl" />
                      <Input value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="Image URL (optional)" className="rounded-xl text-sm" />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={cancelEdit} className="rounded-full">Cancel</Button>
                        <Button onClick={() => saveEdit(post.id)} disabled={savingEdit || !editDraft.trim()} className="rounded-full gap-1.5">
                          {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[15px] text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
                      {post.image_url && (
                        <img src={post.image_url} alt="" className="mt-3 rounded-xl max-h-96 w-full object-cover border border-border/40" loading="lazy" />
                      )}
                    </>
                  )}
                </div>

                {/* reactions strip */}
                <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
                  {Object.entries(reacts).map(([emoji, info]) => (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(post.id, emoji)}
                      disabled={iAmBanned}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${info.mine ? "bg-primary/15 text-primary ring-1 ring-primary/40" : "bg-muted hover:bg-muted/70 text-foreground"}`}
                    >
                      <span className="text-sm">{emoji}</span>
                      <span>{info.count}</span>
                    </button>
                  ))}
                  {/* Add reaction picker */}
                  <div className="relative group">
                    <button disabled={iAmBanned} className="inline-flex items-center justify-center w-8 h-7 rounded-full bg-muted hover:bg-muted/70 text-sm">
                      ☺
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex group-focus-within:flex bg-popover border border-border rounded-full shadow-lg p-1.5 gap-1 z-10">
                      {REACTION_EMOJIS.map(e => (
                        <button key={e} onClick={() => toggleReaction(post.id, e)} className="w-7 h-7 hover:scale-125 transition-transform text-base">{e}</button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenComments(s => ({ ...s, [post.id]: !s[post.id] }))}
                    className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70 text-xs font-bold text-foreground"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> {postComments.length}
                  </button>
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-border/60 bg-muted/30">
                      <div className="p-3 space-y-2">
                        {postComments.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No comments yet — be first!</p>}
                        {postComments.map(c => {
                          const cAuthor = profiles[c.user_id];
                          const mine = c.user_id === user.id;
                          return (
                            <div key={c.id} className="flex items-start gap-2 group">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-[11px] font-bold shrink-0">
                                {(cAuthor?.display_name || cAuthor?.username || "U")[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-card rounded-2xl px-3 py-1.5 border border-border/50">
                                  <p className="text-[11px] font-bold text-foreground">{cAuthor?.display_name || cAuthor?.username || "User"}</p>
                                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">{c.content}</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5 px-1">{new Date(c.created_at).toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                {isAdmin && !ADMIN_EMAILS.includes(cAuthor?.username || "") && (
                                  bannedIds.has(c.user_id)
                                    ? <button onClick={() => unbanUser(c.user_id)} className="text-[10px] text-emerald-500 hover:underline">Unban</button>
                                    : <button onClick={() => banUser(c.user_id)} className="text-[10px] text-destructive hover:underline inline-flex items-center gap-0.5"><Ban className="w-3 h-3" />Ban</button>
                                )}
                                {(mine || isAdmin) && (
                                  <button onClick={() => deleteComment(c.id)} className="text-destructive hover:bg-destructive/10 rounded p-1"><X className="w-3 h-3" /></button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {!iAmBanned ? (
                          <div className="flex items-center gap-2 pt-1">
                            <Input
                              value={commentDraft[post.id] || ""}
                              onChange={e => setCommentDraft(d => ({ ...d, [post.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(post.id); } }}
                              placeholder="Write a comment…"
                              className="rounded-full text-sm h-9"
                            />
                            <Button size="icon" onClick={() => addComment(post.id)} className="rounded-full h-9 w-9 shrink-0"><Send className="w-4 h-4" /></Button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-destructive text-center py-2">You are banned from interacting in the community.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default CommunityPage;