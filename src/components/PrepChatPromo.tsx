import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Camera, Users, Radio, Heart, Sparkles, ArrowRight } from "lucide-react";

const features = [
  { icon: Camera, label: "Post your doubts", desc: "Snap it, tag it, get answers" },
  { icon: MessageCircle, label: "Private DMs", desc: "1-on-1, nobody else reads it" },
  { icon: Users, label: "Groups (GC)", desc: "Study with your squad" },
  { icon: Radio, label: "Channels", desc: "Broadcast to your followers" },
  { icon: Heart, label: "Likes & comments", desc: "Instagram-style feed" },
  { icon: Sparkles, label: "Follow toppers", desc: "Saurabhh is here too 🙃" },
];

const PrepChatPromo = () => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 my-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-fuchsia-500/10 backdrop-blur-xl p-5 sm:p-7 shadow-2xl"
      >
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> New on PrepPro
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black leading-tight">
            PrepChat — the social app <span className="text-primary">built for aspirants</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Post doubts like Instagram, chat like Telegram. Photos, replies, reactions, groups and
            channels — all free, all inside PrepPro Network. And yes, <strong className="text-foreground">Saurabhh is also here</strong> 🙃
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-2.5 rounded-2xl bg-background/50 border border-border/60 p-3">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
                  <f.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight">{f.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/prepchat/feed")}
            className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-primary text-primary-foreground font-black shadow-lg hover:brightness-110 transition"
          >
            Open PrepChat <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default PrepChatPromo;
