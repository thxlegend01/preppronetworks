import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Zap, Sparkles } from "lucide-react";
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
    emoji: "📱",
    accent: "from-rose-500 to-pink-600",
    wash: "from-rose-50 via-pink-50/60 to-orange-50/40 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-orange-950/20",
    bar: "from-rose-400 via-pink-500 to-orange-500",
    subColor: "text-rose-500 dark:text-rose-400",
    ctaWash: "from-rose-100 to-pink-100 dark:from-rose-950/60 dark:to-pink-950/40",
  },
  {
    id: "test-series",
    title: "Test Series",
    subtitle: "CBT Practice — Real Exam Feel",
    description: "PW Test Series, PYQs & Chapter Tests",
    icon: BookOpen,
    path: "/test-series",
    emoji: "📝",
    accent: "from-violet-500 to-purple-600",
    wash: "from-violet-50 via-purple-50/60 to-fuchsia-50/40 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/20",
    bar: "from-violet-400 via-purple-500 to-fuchsia-500",
    subColor: "text-violet-500 dark:text-violet-400",
    ctaWash: "from-violet-100 to-purple-100 dark:from-violet-950/60 dark:to-purple-950/40",
  },
  {
    id: "prepchat",
    title: "PrepChat",
    subtitle: "Connect & Discuss",
    description: "Chat rooms, AI doubts, study groups",
    icon: MessageCircle,
    path: "/prepchat",
    emoji: "💬",
    accent: "from-sky-500 to-blue-600",
    wash: "from-sky-50 via-blue-50/60 to-indigo-50/40 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-indigo-950/20",
    bar: "from-sky-400 via-blue-500 to-indigo-500",
    subColor: "text-sky-500 dark:text-sky-400",
    ctaWash: "from-sky-100 to-blue-100 dark:from-sky-950/60 dark:to-blue-950/40",
  },
  {
    id: "study-material",
    title: "Study Material",
    subtitle: "Notes, Books & Resources",
    description: "Allen, FIITJEE, Resonance + Cengage, Arihant",
    icon: FileText,
    path: "/study-material",
    emoji: "📚",
    accent: "from-emerald-500 to-teal-600",
    wash: "from-emerald-50 via-teal-50/60 to-cyan-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/20",
    bar: "from-emerald-400 via-teal-500 to-cyan-500",
    subColor: "text-emerald-500 dark:text-emerald-400",
    ctaWash: "from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/40",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    subtitle: "YPT Style — Track, Compete & Grow",
    description: "Timer, Analytics, Study Rooms, Leaderboard & Friends",
    icon: Timer,
    path: "/study-tracker",
    emoji: "🔥",
    accent: "from-amber-500 to-orange-600",
    wash: "from-amber-50 via-orange-50/60 to-rose-50/40 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/20",
    bar: "from-amber-400 via-orange-500 to-rose-500",
    subColor: "text-rose-500 dark:text-rose-400",
    ctaWash: "from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/40",
  },
  {
    id: "study-tools",
    title: "PrepPro Study Tools",
    subtitle: "Pro Academic Toolkit",
    description: "Roadmap, AI Doubt Solver, Test Forge, Flashcards & more",
    icon: Sparkles,
    path: "/study-tools",
    emoji: "✨",
    accent: "from-fuchsia-500 to-purple-600",
    wash: "from-fuchsia-50 via-purple-50/60 to-pink-50/40 dark:from-fuchsia-950/40 dark:via-purple-950/30 dark:to-pink-950/20",
    bar: "from-fuchsia-400 via-purple-500 to-pink-500",
    subColor: "text-fuchsia-500 dark:text-fuchsia-400",
    ctaWash: "from-fuchsia-100 to-purple-100 dark:from-fuchsia-950/60 dark:to-purple-950/40",
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

        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {sections.map((section, i) => (
            <div key={section.id} className="flex flex-col">
              <motion.button
                onClick={() => navigate(section.path)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.98 }}
                className={`group relative w-full text-left rounded-3xl border border-border/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${section.wash}`}
              >
                {/* Top color bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${section.bar}`} />

                <div className="relative p-5 sm:p-6">
                  {/* Header row: logo (left) + icon badge (right) */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className={`absolute -inset-2 bg-gradient-to-br ${section.accent} opacity-25 blur-2xl rounded-full`} />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white ring-2 ring-white/80 shadow-lg p-1.5">
                        <img
                          src={prepproLogo}
                          alt="PrepPro Network"
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>

                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${section.accent} flex items-center justify-center shadow-lg ring-1 ring-white/40`}>
                      <section.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.4} />
                    </div>
                  </div>

                  {/* Title with emoji badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                      {section.title}
                    </h3>
                    <span className={`inline-flex items-center justify-center min-w-7 h-6 px-1.5 rounded-full bg-gradient-to-br ${section.accent} text-sm shadow-sm`}>
                      {section.emoji}
                    </span>
                  </div>

                  {/* Colored subtitle */}
                  <p className={`text-sm sm:text-base font-bold ${section.subColor} mb-2 leading-snug`}>
                    {section.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground/90 leading-snug mb-5 line-clamp-2">
                    {section.description}
                  </p>

                  {/* CTA pill */}
                  <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-gradient-to-r ${section.ctaWash} group-hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${section.accent}`} />
                      <span className={`text-sm font-bold ${section.subColor}`}>Explore Now</span>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${section.subColor} group-hover:translate-x-1 transition-transform`} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.button>

              {/* Subtle WhatsApp strip directly below each card (~75% visibility) */}
              <WhatsAppChannelBanner url={WHATSAPP_LINK} label={section.title} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
