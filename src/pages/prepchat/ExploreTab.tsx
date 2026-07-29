import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Radio, Hash, Loader2, MessageCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileLite, getOrCreateDm, initialsOf, nameOf } from "@/lib/prepchat";
import { toast } from "sonner";

interface PublicConv {
  id: string;
  type: "dm" | "group" | "channel";
  title: string | null;
  description: string | null;
  avatar_url: string | null;
}

const ExploreTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [people, setPeople] = useState<ProfileLite[]>([]);
  const [convs, setConvs] = useState<PublicConv[]>([]);
  const [myConvIds, setMyConvIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    // Load every user once — search then filters locally so partial
    // names, usernames and @handles all match instantly.
    const [{ data: p }, { data: c }, mine] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("chat_conversations")
        .select("id, type, title, description, avatar_url")
        .eq("is_public", true)
        .order("last_message_at", { ascending: false })
        .limit(50),
      user
        ? supabase.from("chat_members").select("conversation_id").eq("user_id", user.id)
        : Promise.resolve({ data: [] as { conversation_id: string }[] }),
    ]);
    setPeople(((p as ProfileLite[]) || []).filter((x) => x.user_id !== user?.id));
    setConvs((c as PublicConv[]) || []);
    setMyConvIds(new Set((((mine as { data: { conversation_id: string }[] }).data) || []).map((m) => m.conversation_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const term = q.trim().replace(/^@/, "").toLowerCase();

  const filteredPeople = useMemo(() => {
    if (!term) return people;
    return people.filter((p) =>
      (p.username || "").toLowerCase().includes(term) ||
      (p.display_name || "").toLowerCase().includes(term)
    );
  }, [people, term]);

  const filteredConvs = useMemo(() => {
    if (!term) return convs;
    return convs.filter((c) =>
      (c.title || "").toLowerCase().includes(term) ||
      (c.description || "").toLowerCase().includes(term)
    );
  }, [convs, term]);

  const join = async (conv: PublicConv) => {
    if (!user) return;
    if (!myConvIds.has(conv.id)) {
      const { error } = await supabase.from("chat_members").insert({ conversation_id: conv.id, user_id: user.id, role: "member" });
      if (error) return toast.error("Could not join");
      setMyConvIds((prev) => new Set(prev).add(conv.id));
    }
    navigate(`/prepchat/chats/${conv.id}`);
  };

  const dm = async (otherId: string) => {
    if (!user) return;
    const id = await getOrCreateDm(user.id, otherId);
    if (!id) return toast.error("Could not start chat");
    navigate(`/prepchat/chats/${id}`);
  };

  return (
    <div className="p-4 space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, @username, group or channel…"
          className="pl-9 pr-9 h-10 rounded-full"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
              People · {filteredPeople.length}
            </h3>
            <div className="space-y-1">
              {filteredPeople.map((p) => (
                <div key={p.user_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition">
                  <button
                    onClick={() => p.username && navigate(`/prepchat/u/${p.username}`)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold text-sm shrink-0">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(p)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{p.display_name || p.username || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.username ? `@${p.username}` : "no username yet"}</p>
                    </div>
                  </button>
                  <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 shrink-0" onClick={() => dm(p.user_id)} title="Message">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {!filteredPeople.length && <p className="text-sm text-muted-foreground py-3">No people found.</p>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Groups &amp; Channels</h3>
            <div className="space-y-1">
              {filteredConvs.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0 overflow-hidden">
                    {c.avatar_url ? <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                      : c.type === "channel" ? <Radio className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate flex items-center gap-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />{c.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{c.description || (c.type === "channel" ? "Broadcast channel" : "Group chat")}</p>
                  </div>
                  <Button size="sm" variant={myConvIds.has(c.id) ? "secondary" : "default"} className="rounded-full text-xs" onClick={() => join(c)}>
                    {myConvIds.has(c.id) ? "Open" : "Join"}
                  </Button>
                </div>
              ))}
              {!filteredConvs.length && <p className="text-sm text-muted-foreground py-3">Nothing public yet — create a group or channel from Chats.</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ExploreTab;
