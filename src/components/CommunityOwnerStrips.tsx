import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Megaphone, Send, ArrowRight, Sparkles, Users, Shield, MessagesSquare, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = [
  "thxlegend01era@gmail.com",
  "saurabhsaroj2010@gmail.com",
  "manojadeviaw@gmail.com",
  "saurabh20103060@gmail.com",
];

/**
 * Two long horizontal strips: Open Community + Owner Inbox.
 * Replaces the old PrepJee promo. Designed long, distinctive, and bolder than FolderCards.
 */
const CommunityOwnerStrips = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const [ownerUnread, setOwnerUnread] = useState(0);
  const [communityUnread, setCommunityUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Community (announcements) unread — only for non-admin viewers
      if (!isAdmin) {
        const commSeen = Number(localStorage.getItem("community_seen_ts") || 0);
        const { count: cCount } = await supabase
          .from("community_posts")
          .select("id", { count: "exact", head: true })
          .gt("created_at", new Date(commSeen).toISOString());
        if (!cancelled) setCommunityUnread(cCount || 0);
      } else if (!cancelled) {
        setCommunityUnread(0);
      }

      // Owner chat unread only for non-admin logged-in users
      if (user && !isAdmin) {
        const ownerSeen = Number(localStorage.getItem("owner_chat_seen_ts") || 0);
        const { count: oCount } = await supabase
          .from("owner_messages")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("from_owner", true)
          .gt("created_at", new Date(ownerSeen).toISOString());
        if (!cancelled) setOwnerUnread(oCount || 0);
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(t); };
  }, [user, isAdmin]);

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
      gradient: "from-[#5b21b6] via-[#7c3aed] to-[#db2777]",
      glow: "shadow-[0_18px_60px_-15px_rgba(124,58,237,0.55)]",
      ring: "ring-fuchsia-300/30",
      badge: isAdmin ? 0 : communityUnread,
    },
    {
      id: "dm-inbox",
      title: "My Messages",
      tag: "DM • 1-on-1 with users",
      desc: "Chat privately with other students. Monitored by admins for safety.",
      icon: MessagesSquare,
      meta: [
        { icon: Users, label: "Peer chat" },
        { icon: Shield, label: "Safe" },
      ],
      path: "/dm",
      cta: "Open Messages",
      gradient: "from-[#065f46] via-[#059669] to-[#34d399]",
      glow: "shadow-[0_18px_60px_-15px_rgba(16,185,129,0.55)]",
      ring: "ring-emerald-300/30",
      badge: 0,
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
      gradient: "from-[#0369a1] via-[#0284c7] to-[#22d3ee]",
      glow: "shadow-[0_18px_60px_-15px_rgba(2,132,199,0.55)]",
      ring: "ring-sky-300/30",
      badge: isAdmin ? 0 : ownerUnread,
    },
    ...(isAdmin ? [{
      id: "dm-monitor",
      title: "DM Moderation",
      tag: "ADMIN • Monitor DMs",
      desc: "View every 1-on-1 conversation on the platform (admin only).",
      icon: Eye,
      meta: [
        { icon: Shield, label: "Admin" },
        { icon: Eye, label: "Monitor" },
      ],
      path: "/admin/dm-monitor",
      cta: "Open Monitor",
      gradient: "from-[#78350f] via-[#b45309] to-[#f59e0b]",
      glow: "shadow-[0_18px_60px_-15px_rgba(180,83,9,0.55)]",
      ring: "ring-amber-300/30",
      badge: 0,
    }] : []),
  ];

  return (
    <section className="py-3 relative z-20">
      <div className="container mx-auto px-4 max-w-xl flex flex-col gap-2.5">
        {strips.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => navigate(s.path)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.985 }}
            className={`group relative w-full text-left overflow-hidden rounded-2xl ring-1 ${s.ring} ${s.glow} transition-all duration-300 hover:-translate-y-0.5`}
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

            <div className="relative flex items-center gap-2.5 p-2.5 sm:p-3">
              {/* Icon column */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/25 blur-lg rounded-2xl" />
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 ring-1 ring-white/40 backdrop-blur flex items-center justify-center">
                    <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.4} />
                  </div>
                  {s.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-md">
                      {s.badge > 99 ? "99+" : s.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-white">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur text-[8px] sm:text-[9px] font-black tracking-[0.1em] uppercase ring-1 ring-white/30">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  {s.tag}
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight drop-shadow-sm mt-0.5">
                  {s.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/85 leading-snug line-clamp-1">
                  {s.desc}
                </p>
              </div>

              {/* CTA chevron */}
              <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 flex items-center justify-center text-foreground shadow group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.6} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CommunityOwnerStrips;