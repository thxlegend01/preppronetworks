import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Trash2, X, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  message: string;
  link: string | null;
  created_at: string;
}

const AnnouncementSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) { setIsAdmin(false); return; }
    const { data } = await supabase.rpc("is_announcement_admin", { _user_id: user.id });
    setIsAdmin(!!data);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setAnnouncements(data);
  };

  const handlePost = async () => {
    if (!title.trim() || !message.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("announcements").insert({
      title: title.trim(),
      message: message.trim(),
      link: link.trim() || null,
      admin_user_id: user!.id,
    });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Failed to post", description: error.message });
    } else {
      toast({ title: "Announcement posted!" });
      setTitle(""); setMessage(""); setLink(""); setShowForm(false);
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").update({ is_active: false }).eq("id", id);
    fetchAnnouncements();
    toast({ title: "Announcement removed" });
  };

  if (announcements.length === 0 && !isAdmin) return null;

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Announcements</h2>
          </div>
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="gap-1.5 border-primary/30">
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "New"}
            </Button>
          )}
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-5 rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm space-y-3">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-background/50" />
                <Textarea placeholder="Message..." value={message} onChange={e => setMessage(e.target.value)} rows={3} className="bg-background/50" />
                <Input placeholder="Link (optional)" value={link} onChange={e => setLink(e.target.value)} className="bg-background/50" />
                <Button onClick={handlePost} disabled={loading || !title.trim() || !message.trim()} className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? "Posting..." : "Post Announcement"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-4 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all relative"
            >
              {isAdmin && (
                <button onClick={() => handleDelete(a.id)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <h4 className="font-bold text-foreground text-sm mb-1">{a.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{a.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">
                  {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {a.link && (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                    Learn More <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {announcements.length === 0 && isAdmin && (
            <p className="text-center text-sm text-muted-foreground py-8">No announcements yet. Create your first one!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementSection;
