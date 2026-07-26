import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Radio, Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ProfileLite, fetchProfiles, getOrCreateDm, initialsOf, nameOf } from "@/lib/prepchat";
import { cn } from "@/lib/utils";

type Mode = "dm" | "group" | "channel";

const NewChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("dm");
  const [q, setQ] = useState("");
  const [people, setPeople] = useState<ProfileLite[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      const query = supabase.from("profiles").select("user_id, username, display_name, avatar_url").limit(25);
      if (q.trim()) query.or(`username.ilike.%${q.trim()}%,display_name.ilike.%${q.trim()}%`);
      const { data } = await query;
      setPeople(((data as ProfileLite[]) || []).filter((p) => p.user_id !== user?.id));
    }, 250);
    return () => clearTimeout(t);
  }, [q, user]);

  const startDm = async (otherId: string) => {
    if (!user) return;
    setBusy(true);
    const id = await getOrCreateDm(user.id, otherId);
    setBusy(false);
    if (!id) return toast.error("Could not start chat");
    navigate(`/prepchat/chats/${id}`, { replace: true });
  };

  const createGroup = async () => {
    if (!user) return;
    if (!title.trim()) return toast.error("Give it a name");
    setBusy(true);
    try {
      const { data: conv, error } = await supabase
        .from("chat_conversations")
        .insert({ type: mode, title: title.trim(), description: description.trim() || null, is_public: isPublic, created_by: user.id })
        .select("id")
        .single();
      if (error || !conv) throw error;
      const members = [
        { conversation_id: conv.id, user_id: user.id, role: "owner" as const },
        ...selected.map((id) => ({ conversation_id: conv.id, user_id: id, role: "member" as const })),
      ];
      await supabase.from("chat_members").insert(members);
      navigate(`/prepchat/chats/${conv.id}`, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="font-black text-lg">New chat</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {([["dm", "Direct", Users], ["group", "Group", Users], ["channel", "Channel", Radio]] as const).map(([m, label, Icon]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-bold transition ring-1",
                mode === m ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {mode !== "dm" && (
          <div className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={mode === "channel" ? "Channel name" : "Group name"} className="rounded-xl" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className="rounded-xl" />
            <div className="flex items-center justify-between rounded-xl bg-card ring-1 ring-border px-3 py-2.5">
              <div>
                <p className="text-sm font-bold">Public</p>
                <p className="text-[11px] text-muted-foreground">Anyone can find and join from Explore</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by @username" className="pl-9 rounded-full h-10" />
        </div>

        <div className="space-y-1">
          {people.map((p) => {
            const isSel = selected.includes(p.user_id);
            return (
              <button
                key={p.user_id}
                onClick={() => mode === "dm" ? startDm(p.user_id) : setSelected((s) => isSel ? s.filter((x) => x !== p.user_id) : [...s, p.user_id])}
                disabled={busy}
                className={cn("w-full flex items-center gap-3 p-2 rounded-xl transition text-left", isSel ? "bg-primary/10" : "hover:bg-muted")}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold text-sm shrink-0">
                  {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(p)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{nameOf(p)}</p>
                  {p.username && <p className="text-xs text-muted-foreground truncate">@{p.username}</p>}
                </div>
                {mode !== "dm" && <span className="text-xs font-bold text-primary">{isSel ? "Added" : "Add"}</span>}
              </button>
            );
          })}
          {!people.length && <p className="text-sm text-muted-foreground py-3 text-center">No users found.</p>}
        </div>

        {mode !== "dm" && (
          <Button className="w-full h-11 rounded-xl font-bold" onClick={createGroup} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : `Create ${mode}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewChatPage;