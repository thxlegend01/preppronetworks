import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Zap, Megaphone, Sparkles, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import prepproLogo from "@/assets/preppro-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Study Apps",
    subtitle: "Premium Coaching — Free Access",
    description: "PW, Unacademy, Next Toppers & 10+ platforms",
    icon: Smartphone,
    path: "/apps",
    count: "10+",
    accent: "from-rose-500 to-pink-600",
    ring: "ring-rose-500/40",
    glow: "group-hover:shadow-rose-500/25",
    tint: "from-rose-500/15 via-transparent to-transparent",
  },
  {
    id: "test-series",
    title: "Test Series",
    subtitle: "CBT Practice — Real Exam Feel",
    description: "PW Test Series, PYQs & Chapter Tests",
    icon: BookOpen,
    path: "/test-series",
    count: "4",
    accent: "from-violet-500 to-purple-600",
    ring: "ring-violet-500/40",
    glow: "group-hover:shadow-violet-500/25",
    tint: "from-violet-500/15 via-transparent to-transparent",
  },
  {
    id: "study-material",
    title: "Study Material",
    subtitle: "Notes, Books & Resources",
    description: "Allen, FIITJEE, Resonance + Cengage, Arihant",
    icon: FileText,
    path: "/study-material",
    count: "50+",
    accent: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/40",
    glow: "group-hover:shadow-emerald-500/25",
    tint: "from-emerald-500/15 via-transparent to-transparent",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    subtitle: "Track & Boost Performance",
    description: "Timer, Analytics, Rooms & Leaderboard",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
    accent: "from-amber-500 to-orange-600",
    ring: "ring-amber-500/40",
    glow: "group-hover:shadow-amber-500/25",
    tint: "from-amber-500/15 via-transparent to-transparent",
  },
  {
    id: "prepchat",
    title: "PrepChat",
    subtitle: "Connect & Discuss",
    description: "Chat rooms, AI doubts, study groups",
    icon: MessageCircle,
    path: "/prepchat",
    count: "💬",
    accent: "from-sky-500 to-blue-600",
    ring: "ring-sky-500/40",
    glow: "group-hover:shadow-sky-500/25",
    tint: "from-sky-500/15 via-transparent to-transparent",
  },
  {
    id: "announcements",
    title: "Announcements",
    subtitle: "Latest News & Updates",
    description: "Official PrepPro updates & alerts",
    icon: Megaphone,
    path: "/announcements",
    count: "📢",
    accent: "from-yellow-500 to-amber-600",
    ring: "ring-yellow-500/40",
    glow: "group-hover:shadow-yellow-500/25",
    tint: "from-yellow-500/15 via-transparent to-transparent",
  },
  {
    id: "study-tools",
    title: "PrepPro Study Tools",
    subtitle: "Pro Academic Toolkit",
    description: "Roadmap, AI Doubt Solver, Test Forge, Flashcards & more",
    icon: Sparkles,
    path: "/study-tools",
    count: "✨",
    accent: "from-fuchsia-500 to-purple-600",
    ring: "ring-fuchsia-500/40",
    glow: "group-hover:shadow-fuchsia-500/25",
    tint: "from-fuchsia-500/15 via-transparent to-transparent",
  },
  {
    id: "entertainment",
    title: "PrepPro Entertainment",
    subtitle: "Refresh Your Mind",
    description: "Live IPL scores & quick break apps",
    icon: Tv,
    path: "/entertainment",
    count: "🎬",
    accent: "from-pink-500 to-orange-500",
    ring: "ring-pink-500/40",
    glow: "group-hover:shadow-pink-500/25",
    tint: "from-pink-500/15 via-transparent to-transparent",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Quick Access</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] mb-3 leading-[1]">
            Explore <span className="text-gradient">PrepPro Network</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything for JEE, NEET & competitive exams</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              onClick={() => navigate(section.path)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              className={`group relative text-left p-4 sm:p-5 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl ${section.glow}`}
            >
              {/* Inner tint wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.tint} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Number badge */}
              <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-muted-foreground/40 tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Logo with gradient halo */}
              <div className="relative mb-4 inline-flex">
                <div className={`absolute -inset-2 bg-gradient-to-br ${section.accent} opacity-30 blur-2xl rounded-full group-hover:opacity-60 transition-opacity duration-500`} />
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden ring-2 ${section.ring} shadow-lg`}>
                  <img
                    src={prepproLogo}
                    alt="PrepPro Network"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Section icon corner badge */}
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gradient-to-br ${section.accent} flex items-center justify-center shadow-md ring-2 ring-background`}>
                    <section.icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Title + subtitle */}
              <h3 className="relative text-base sm:text-lg font-black tracking-tight text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="relative text-[11px] sm:text-xs text-muted-foreground/90 mb-3 line-clamp-2 leading-snug">
                {section.subtitle}
              </p>

              {/* Footer row */}
              <div className="relative flex items-center justify-between pt-2 border-t border-border/40">
                <span className={`text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${section.accent} bg-clip-text text-transparent`}>
                  Explore
                </span>
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${section.accent} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                  <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
