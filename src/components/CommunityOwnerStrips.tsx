import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Megaphone, Send, ArrowRight, Sparkles, Users, Shield } from "lucide-react";

/**
 * Two long horizontal strips: Open Community + Owner Inbox.
 * Replaces the old PrepJee promo. Designed long, distinctive, and bolder than FolderCards.
 */
const CommunityOwnerStrips = () => {
  const navigate = useNavigate();

  const strips = [
    {
      id: "community",
      title: "Open Community",
      tag: "LIVE • Verified Admins",
      desc: "Official posts • react with emojis • drop your thoughts in comments",
      icon: Megaphone,
      meta: [
        { icon: Users, label: "Everyone" },
        { icon: Sparkles, label: "Reactions" },
      ],
      path: "/community",
      cta: "Open Community",
      // Bold violet → fuchsia announcement vibe
      gradient: "from-[#5b21b6] via-[#7c3aed] to-[#db2777]",
      glow: "shadow-[0_18px_60px_-15px_rgba(124,58,237,0.55)]",
      ring: "ring-fuchsia-300/30",
    },
    {
      id: "owner-chat",
      title: "Message the Owner",
      tag: "PRIVATE • 1-on-1",
      desc: "A direct line to the owner. Only you and the owner can read your chat.",
      icon: Send,
      meta: [
        { icon: Shield, label: "Private" },
        { icon: Sparkles, label: "Replies fast" },
      ],
      path: "/owner-chat",
      cta: "Start Chat",
      // Telegram-like sky → blue
      gradient: "from-[#0369a1] via-[#0284c7] to-[#22d3ee]",
      glow: "shadow-[0_18px_60px_-15px_rgba(2,132,199,0.55)]",
      ring: "ring-sky-300/30",
    },
  ];

  return (
    <section className="py-6 relative z-20">
      <div className="container mx-auto px-4 max-w-2xl flex flex-col gap-4">
        {strips.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => navigate(s.path)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.985 }}
            className={`group relative w-full text-left overflow-hidden rounded-3xl ring-1 ${s.ring} ${s.glow} transition-all duration-300 hover:-translate-y-0.5`}
          >
            {/* Base gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
            {/* Subtle radial highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
            {/* Diagonal sheen */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(120deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 22px)",
              }}
            />

            {/* Animated shine */}
            <motion.div
              aria-hidden
              className="absolute -inset-y-2 -left-1/3 w-1/3 skew-x-12 bg-white/15 blur-md"
              initial={{ x: "-20%" }}
              animate={{ x: "420%" }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />

            <div className="relative flex items-center gap-4 p-4 sm:p-5">
              {/* Icon column */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/30 blur-xl rounded-2xl" />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 ring-1 ring-white/40 backdrop-blur flex items-center justify-center">
                    <s.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.4} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black tracking-[0.12em] uppercase ring-1 ring-white/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-sm">
                  {s.title}
                </h3>
                <p className="text-[12.5px] sm:text-sm text-white/85 leading-snug line-clamp-2 mt-0.5">
                  {s.desc}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {s.meta.map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/15 backdrop-blur text-[10px] font-semibold text-white/95 ring-1 ring-white/20"
                    >
                      <m.icon className="w-3 h-3" />
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA chevron */}
              <div className="shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-foreground text-xs font-black shadow-md group-hover:translate-x-0.5 transition-transform">
                {s.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="sm:hidden shrink-0 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-foreground shadow group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={2.6} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CommunityOwnerStrips;