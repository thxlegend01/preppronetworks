import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Radio, Hash, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileLite, initialsOf, nameOf } from "@/lib/prepchat";
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
    const term = q.trim();
    const peopleQuery = supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url")
      .limit(20);
    if (term) peopleQuery.or(`username.ilike.%${term}%,display_name.ilike.%${term}%`);

    const convQuery = supabase
      .from("chat_conversations")
      .select("id, type, title, description, avatar_url")
      .eq("is_public", true)
      .order("last_message_at", { ascending: false })
      .limit(20);
    if (term) convQuery.ilike("title", `%${term}%`);

    const [{ data: p }, { data: c }, mine] = await Promise.all([
      peopleQuery,
      convQuery,
      user ? supabase.from("chat_members").select("conversation_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { conversation_id: string }[] }),
    ]);
    setPeople(((p as ProfileLite[]) || []).filter((x) => x.user_id !== user?.id));
    setConvs((c as PublicConv[]) || []);
    setMyConvIds(new Set((((mine as { data: { conversation_id: string }[] }).data) || []).map((m) => m.conversation_id)));
    setLoading(false);
  }, [q, user]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const join = async (conv: PublicConv) => {
    if (!user) return;
    if (!myConvIds.has(conv.id)) {
      const { error } = await supabase.from("chat_members").insert({ conversation_id: conv.id, user_id: user.id, role: "member" });
      if (error) return toast.error("Could not join");
    }
    navigate(`/prepchat/chats/${conv.id}`);
  };

  return (
    <div className="p-4 space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people, groups, channels…" className="pl-9 h-10 rounded-full" />
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">People</h3>
            <div className="space-y-1">
              {people.map((p) => (
                <button
                  key={p.user_id}
                  onClick={() => navigate(p.username ? `/prepchat/u/${p.username}` : "/prepchat/explore")}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition text-left"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 grid place-items-center text-white font-bold text-sm shrink-0">
                    {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initialsOf(p)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{nameOf(p)}</p>
                    {p.username && <p className="text-xs text-muted-foreground truncate">@{p.username}</p>}
                  </div>
                </button>
              ))}
              {!people.length && <p className="text-sm text-muted-foreground py-3">No people found.</p>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Groups & Channels</h3>
            <div className="space-y-1">
              {convs.map((c) => (
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
              {!convs.length && <p className="text-sm text-muted-foreground py-3">Nothing public yet — create a group or channel from Chats.</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ExploreTab;