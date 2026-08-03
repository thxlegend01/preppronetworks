import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Brain, Check, HelpCircle, ImagePlus, Loader2, Plus, Send, Trash2, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProfileLite, fetchProfiles, initialsOf, nameOf, timeAgo, uploadChatMedia } from "@/lib/prepchat";
import { cn } from "@/lib/utils";

export interface Story {
  id: string;
  author_id: string;
  kind: "media" | "poll" | "quiz" | "question";
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  background: string | null;
  options: string[];
  correct_option: number | null;
  expires_at: string;
  created_at: string;
}

interface StoryView {
  id: string;
  story_id: string;
  viewer_id: string;
  reaction: string | null;
  answer_index: number | null;
  answer_text: string | null;
}

const REACTIONS = ["❤️", "🔥", "😂", "😮", "👏", "🙏"];
const BACKGROUNDS = [
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#2563eb)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0891b2)",
  "linear-gradient(135deg,#111827,#374151)",
];
const KINDS = [
  { key: "media", label: "Status", icon: ImagePlus },
  { key: "poll", label: "Poll", icon: BarChart3 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "question", label: "Question", icon: HelpCircle },
] as const;

const Stories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [views, setViews] = useState<StoryView[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeAuthor, setActiveAuthor] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("prepchat_stories")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: true });
    const list = ((data || []) as unknown as Story[]).map((s) => ({ ...s, options: s.options || [] }));
    setStories(list);
    setProfiles(await fetchProfiles(list.map((s) => s.author_id)));
    if (list.length) {
      const { data: v } = await supabase
        .from("prepchat_story_views")
        .select("id, story_id, viewer_id, reaction, answer_index, answer_text")
        .in("story_id", list.map((s) => s.id));
      setViews((v || []) as StoryView[]);
    } else {
      setViews([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<string, Story[]>();
    stories.forEach((s) => { map.set(s.author_id, [...(map.get(s.author_id) || []), s]); });
    const entries = Array.from(map.entries());
    // my stories first
    entries.sort((a, b) => (a[0] === user?.id ? -1 : b[0] === user?.id ? 1 : 0));
    return entries;
  }, [stories, user]);

  const seenByMe = (authorStories: Story[]) =>
    authorStories.every((s) => views.some((v) => v.story_id === s.id && v.viewer_id === user?.id));

  const myStories = grouped.find(([a]) => a === user?.id)?.[1] || [];

  return (
    <div className="px-4 pt-3">
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
        {/* Add story */}
        <button onClick={() => setComposerOpen(true)} className="flex flex-col items-center gap-1 shrink-0 w-[68px]">
          <div className="relative w-16 h-16 rounded-full bg-muted grid place-items-center ring-2 ring-border overflow-hidden">
            {myStories[0]?.media_url ? (
              <img src={myStories[0].media_url} alt="" className="w-full h-full object-cover opacity-70" />
            ) : (
              <span className="text-lg font-black text-muted-foreground">{initialsOf(profiles[user?.id || ""])}</span>
            )}
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center ring-2 ring-background">
              <Plus className="w-3.5 h-3.5" />
            </span>
          </div>
          <span className="text-[10px] font-semibold truncate w-full text-center">Your story</span>
        </button>

        {loading && <div className="grid place-items-center w-16 h-16"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>}

        {grouped.filter(([a]) => a !== user?.id).map(([authorId, list]) => (
          <button key={authorId} onClick={() => setActiveAuthor(authorId)} className="flex flex-col items-center gap-1 shrink-0 w-[68px]">
            <div className={cn(
              "w-16 h-16 rounded-full p-[2.5px]",
              seenByMe(list) ? "bg-border" : "bg-gradient-to-tr from-primary via-pink-500 to-amber-400"
            )}>
              <div className="w-full h-full rounded-full overflow-hidden bg-muted grid place-items-center ring-2 ring-background">
                {profiles[authorId]?.avatar_url
                  ? <img src={profiles[authorId].avatar_url!} alt="" className="w-full h-full object-cover" />
                  : <span className="text-lg font-black text-muted-foreground">{initialsOf(profiles[authorId])}</span>}
              </div>
            </div>
            <span className="text-[10px] font-semibold truncate w-full text-center">{nameOf(profiles[authorId])}</span>
          </button>
        ))}
      </div>

      {!!myStories.length && (
        <button onClick={() => setActiveAuthor(user!.id)} className="text-[11px] text-primary font-semibold -mt-1 mb-1">
          View my {myStories.length} active {myStories.length === 1 ? "story" : "stories"} →
        </button>
      )}

      <StoryComposer open={composerOpen} onOpenChange={setComposerOpen} onPosted={load} />

      <AnimatePresence>
        {activeAuthor && (
          <StoryViewer
            stories={grouped.find(([a]) => a === activeAuthor)?.[1] || []}
            author={profiles[activeAuthor]}
            views={views}
            onClose={() => { setActiveAuthor(null); load(); }}
            onChanged={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- Composer ---------------- */

const StoryComposer = ({ open, onOpenChange, onPosted }: { open: boolean; onOpenChange: (v: boolean) => void; onPosted: () => void }) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<Story["kind"]>("media");
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correct, setCorrect] = useState(0);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setKind("media"); setContent(""); setOptions(["", ""]); setCorrect(0); setBg(BACKGROUNDS[0]); setFile(null); };

  const submit = async () => {
    if (!user) return;
    if (kind !== "media" && !content.trim()) return toast.error("Add a question first");
    if ((kind === "poll" || kind === "quiz") && options.filter((o) => o.trim()).length < 2) return toast.error("Add at least 2 options");
    if (kind === "media" && !content.trim() && !file) return toast.error("Write something or add a photo");
    setBusy(true);
    try {
      let media_url: string | null = null;
      let media_type: string | null = null;
      if (file) {
        if (file.size > 10 * 1024 * 1024) throw new Error("Max 10MB");
        media_url = await uploadChatMedia(file, user.id);
        media_type = file.type;
      }
      const { error } = await supabase.from("prepchat_stories").insert({
        author_id: user.id,
        kind,
        content: content.trim() || null,
        media_url,
        media_type,
        background: file ? null : bg,
        options: kind === "poll" || kind === "quiz" ? options.map((o) => o.trim()).filter(Boolean) : [],
        correct_option: kind === "quiz" ? correct : null,
      });
      if (error) throw error;
      toast.success("Story posted — live for 24 hours ✨");
      reset();
      onOpenChange(false);
      onPosted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not post story");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader><DialogTitle className="font-black">New Story · 24h</DialogTitle></DialogHeader>

        <div className="grid grid-cols-4 gap-2">
          {KINDS.map((k) => (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 rounded-2xl text-[10px] font-bold border transition",
                kind === k.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <k.icon className="w-4 h-4" />
              {k.label}
            </button>
          ))}
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={kind === "media" ? "Say something…" : kind === "question" ? "Ask your doubt…" : "Your question…"}
          className="rounded-2xl min-h-[80px]"
        />

        {(kind === "poll" || kind === "quiz") && (
          <div className="space-y-2">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                {kind === "quiz" && (
                  <button
                    onClick={() => setCorrect(i)}
                    className={cn("w-6 h-6 rounded-full border grid place-items-center shrink-0",
                      correct === i ? "bg-emerald-500 border-emerald-500 text-white" : "border-border text-transparent")}
                    title="Mark as correct"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <Input
                  value={o}
                  onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Option ${i + 1}`}
                  className="rounded-xl h-9"
                />
                {options.length > 2 && (
                  <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {options.length < 4 && (
              <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => setOptions([...options, ""])}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add option
              </Button>
            )}
          </div>
        )}

        {kind === "media" && (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="w-3.5 h-3.5 mr-1" /> {file ? "Change photo" : "Add photo"}
              </Button>
              {file && <span className="text-[11px] text-muted-foreground truncate">{file.name}</span>}
            </div>
          </>
        )}

        {!file && (
          <div className="flex gap-2">
            {BACKGROUNDS.map((b) => (
              <button key={b} onClick={() => setBg(b)} style={{ background: b }}
                className={cn("w-8 h-8 rounded-full ring-2", bg === b ? "ring-primary" : "ring-transparent")} />
            ))}
          </div>
        )}

        <Button onClick={submit} disabled={busy} className="rounded-full w-full font-bold">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share to Story"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

/* ---------------- Viewer ---------------- */

const StoryViewer = ({
  stories, author, views, onClose, onChanged,
}: { stories: Story[]; author?: ProfileLite; views: StoryView[]; onClose: () => void; onChanged: () => void }) => {
  const { user } = useAuth();
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [localViews, setLocalViews] = useState<StoryView[]>(views);
  const story = stories[i];
  const mine = story?.author_id === user?.id;

  useEffect(() => { setLocalViews(views); }, [views]);

  const myView = localViews.find((v) => v.story_id === story?.id && v.viewer_id === user?.id);
  const storyViews = localViews.filter((v) => v.story_id === story?.id);

  const upsert = useCallback(async (patch: Partial<StoryView>) => {
    if (!user || !story) return;
    const payload = {
      story_id: story.id,
      viewer_id: user.id,
      reaction: patch.reaction ?? myView?.reaction ?? null,
      answer_index: patch.answer_index ?? myView?.answer_index ?? null,
      answer_text: patch.answer_text ?? myView?.answer_text ?? null,
    };
    setLocalViews((prev) => {
      const rest = prev.filter((v) => !(v.story_id === story.id && v.viewer_id === user.id));
      return [...rest, { id: myView?.id || "temp", ...payload } as StoryView];
    });
    await supabase.from("prepchat_story_views").upsert(payload, { onConflict: "story_id,viewer_id" });
    onChanged();
  }, [user, story, myView, onChanged]);

  // register view
  useEffect(() => {
    if (story && user && !myView) upsert({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  // progress timer
  useEffect(() => {
    setProgress(0);
    if (!story) return;
    const duration = story.kind === "media" ? 6000 : 12000;
    const t = setInterval(() => {
      if (paused) return;
      setProgress((p) => {
        const next = p + 100 / (duration / 100);
        if (next >= 100) {
          clearInterval(t);
          if (i < stories.length - 1) setI(i + 1); else onClose();
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(t);
  }, [i, paused, story, stories.length, onClose]);

  if (!story) return null;

  const counts = story.options.map((_, idx) => storyViews.filter((v) => v.answer_index === idx).length);
  const totalVotes = counts.reduce((a, b) => a + b, 0);
  const answered = myView?.answer_index != null;

  const remove = async () => {
    await supabase.from("prepchat_stories").delete().eq("id", story.id);
    toast.success("Story deleted");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* progress bars */}
      <div className="flex gap-1 p-2 pt-3">
        {stories.map((_, idx) => (
          <div key={idx} className="h-0.5 flex-1 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full bg-white transition-[width] duration-100" style={{ width: `${idx < i ? 100 : idx === i ? progress : 0}%` }} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 pb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 grid place-items-center text-white text-xs font-bold">
          {author?.avatar_url ? <img src={author.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(author)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-bold truncate">{nameOf(author)}</p>
          <p className="text-white/60 text-[10px]">{timeAgo(story.created_at)}</p>
        </div>
        {mine && (
          <button onClick={remove} className="text-white/80 p-1.5"><Trash2 className="w-4 h-4" /></button>
        )}
        <button onClick={onClose} className="text-white p-1.5"><X className="w-5 h-5" /></button>
      </div>

      {/* content */}
      <div
        className="flex-1 relative grid place-items-center px-6"
        style={{ background: story.media_url ? "#000" : story.background || BACKGROUNDS[0] }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
      >
        <button className="absolute left-0 inset-y-0 w-1/4" onClick={() => (i > 0 ? setI(i - 1) : null)} aria-label="Previous" />
        <button className="absolute right-0 inset-y-0 w-1/4" onClick={() => (i < stories.length - 1 ? setI(i + 1) : onClose())} aria-label="Next" />

        <div className="relative z-10 w-full max-w-sm text-center space-y-4">
          {story.media_url && <img src={story.media_url} alt="" className="max-h-[45vh] w-full object-contain rounded-2xl" />}
          {story.content && (
            <p className="text-white font-black text-xl leading-snug drop-shadow">{story.content}</p>
          )}

          {(story.kind === "poll" || story.kind === "quiz") && (
            <div className="space-y-2 text-left">
              {story.options.map((o, idx) => {
                const pct = totalVotes ? Math.round((counts[idx] / totalVotes) * 100) : 0;
                const isCorrect = story.kind === "quiz" && story.correct_option === idx;
                const chosen = myView?.answer_index === idx;
                return (
                  <button
                    key={idx}
                    disabled={answered && !mine}
                    onClick={() => !answered && upsert({ answer_index: idx })}
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl px-4 py-3 text-sm font-bold text-white bg-white/15 backdrop-blur ring-1 ring-white/25",
                      chosen && "ring-2 ring-white",
                      (answered || mine) && story.kind === "quiz" && isCorrect && "ring-2 ring-emerald-400"
                    )}
                  >
                    {(answered || mine) && (
                      <span className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${pct}%` }} />
                    )}
                    <span className="relative flex items-center justify-between gap-2">
                      <span>{o}</span>
                      {(answered || mine) && <span className="text-xs opacity-90">{pct}%</span>}
                    </span>
                  </button>
                );
              })}
              {(answered || mine) && (
                <p className="text-white/70 text-[11px] text-center">
                  {totalVotes} {totalVotes === 1 ? "response" : "responses"}
                  {story.kind === "quiz" && answered && !mine && (
                    myView?.answer_index === story.correct_option ? " · ✅ Correct!" : " · ❌ Try next time"
                  )}
                </p>
              )}
            </div>
          )}

          {story.kind === "question" && !mine && (
            <div className="flex items-center gap-2">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onFocus={() => setPaused(true)}
                placeholder="Type your answer…"
                className="rounded-full h-10 bg-white/15 border-white/30 text-white placeholder:text-white/60"
              />
              <Button
                size="icon"
                className="rounded-full h-10 w-10 shrink-0"
                onClick={() => { if (answer.trim()) { upsert({ answer_text: answer.trim() }); setAnswer(""); toast.success("Answer sent"); } }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {story.kind === "question" && mine && (
            <div className="space-y-1 text-left max-h-40 overflow-y-auto">
              {storyViews.filter((v) => v.answer_text).map((v) => (
                <p key={v.id} className="text-white/90 text-xs bg-white/10 rounded-xl px-3 py-2">{v.answer_text}</p>
              ))}
              {!storyViews.some((v) => v.answer_text) && <p className="text-white/60 text-xs text-center">No answers yet</p>}
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="p-3 flex items-center gap-2">
        {mine ? (
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
            <Eye className="w-4 h-4" /> {storyViews.length} viewer{storyViews.length === 1 ? "" : "s"}
            <span className="ml-2 flex gap-1">
              {storyViews.filter((v) => v.reaction).map((v) => <span key={v.id}>{v.reaction}</span>)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mx-auto">
            {REACTIONS.map((r) => (
              <button
                key={r}
                onClick={() => upsert({ reaction: r })}
                className={cn("text-2xl transition hover:scale-125", myView?.reaction === r && "scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]")}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Stories;
