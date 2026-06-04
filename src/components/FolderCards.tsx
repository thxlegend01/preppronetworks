import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Zap, Megaphone, Sparkles, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";

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

        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          {sections.map((section, i) => (
            <div key={section.id} className="flex flex-col gap-3">
              <motion.button
                onClick={() => navigate(section.path)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.98 }}
                className={`group relative w-full text-left p-5 sm:p-6 rounded-3xl border border-border/60 bg-card/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl ${section.glow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.tint} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-muted-foreground/40 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-center gap-4 sm:gap-5">
                  {/* Logo with halo + icon badge */}
                  <div className="relative shrink-0">
                    <div className={`absolute -inset-2 bg-gradient-to-br ${section.accent} opacity-40 blur-2xl rounded-full group-hover:opacity-70 transition-opacity duration-500`} />
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ${section.ring} shadow-lg`}>
                      <img
                        src={prepproLogo}
                        alt="PrepPro Network"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gradient-to-br ${section.accent} flex items-center justify-center shadow-md ring-2 ring-background`}>
                        <section.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-2xl font-black tracking-tight text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground/90 leading-snug line-clamp-2">
                      {section.subtitle}
                    </p>
                    <p className="hidden sm:block text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                      {section.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${section.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-300`}>
                    <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </motion.button>

              {/* WhatsApp link between every section */}
              <WhatsAppChannelBanner url={WHATSAPP_LINK} label={section.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
