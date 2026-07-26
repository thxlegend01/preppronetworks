import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SUBJECT_TAGS, uploadChatMedia } from "@/lib/prepchat";
import { cn } from "@/lib/utils";

const NewPostTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<string>("General");
  const [busy, setBusy] = useState(false);

  const pick = (f: File | null) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!user) return;
    if (!content.trim() && !file) return toast.error("Write your doubt or add a photo");
    setBusy(true);
    try {
      let imageUrl: string | null = null;
      if (file) imageUrl = await uploadChatMedia(file, user.id);
      const { error } = await supabase.from("community_posts").insert({
        author_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        subject_tag: tag,
      });
      if (error) throw error;
      toast.success("Posted to the feed");
      setContent(""); setFile(null); setPreview(null);
      navigate("/prepchat/feed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-black">Post a doubt</h2>

      <div
        onClick={() => fileRef.current?.click()}
        className="relative rounded-2xl border border-dashed border-border bg-card/60 backdrop-blur grid place-items-center min-h-40 overflow-hidden cursor-pointer"
      >
        {preview ? (
          <>
            <img src={preview} alt="Doubt preview" className="w-full max-h-80 object-contain" />
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 grid place-items-center"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <ImagePlus className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">Add a photo of your doubt</p>
            <p className="text-xs">optional • max 10MB</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0] || null)} />
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Describe your doubt…"
        rows={4}
        className="rounded-2xl"
      />

      <div className="flex flex-wrap gap-2">
        {SUBJECT_TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition",
              tag === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Button className="w-full rounded-xl h-11 font-bold" onClick={submit} disabled={busy}>
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share doubt"}
      </Button>
    </div>
  );
};

export default NewPostTab;