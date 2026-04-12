import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import pwLogo from "@/assets/pw-logo-new.jpg";
import prepproLogo from "@/assets/preppro-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Study Apps",
    subtitle: "Premium Coaching — Free Access",
    description: "PW, Unacademy, Next Toppers & 10+ platforms",
    icon: Smartphone,
    logo: pwLogo,
    path: "/apps",
    count: "10+",
    accent: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/8 border-rose-500/15 hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/10",
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
    bg: "bg-violet-500/8 border-violet-500/15 hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    id: "study-material",
    title: "Study Material",
    subtitle: "Notes, Books & Resources",
    description: "Allen, FIITJEE, Resonance + Cengage, Arihant",
    icon: FileText,
    logo: prepproLogo,
    path: "/study-material",
    count: "50+",
    accent: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/8 border-emerald-500/15 hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
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
    bg: "bg-amber-500/8 border-amber-500/15 hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
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
    bg: "bg-sky-500/8 border-sky-500/15 hover:border-sky-500/30",
    glow: "group-hover:shadow-sky-500/10",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Quick Access</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Explore <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything for JEE, NEET & competitive exams</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(section.path)}
              className={`group text-left p-5 rounded-2xl border ${section.bg} backdrop-blur-sm hover:shadow-2xl ${section.glow} transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  {section.logo ? (
                    <img src={section.logo} alt={section.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${section.accent} flex items-center justify-center`}>
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {section.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">{section.subtitle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-br ${section.accent} text-white shadow-sm`}>
                  {section.count}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{section.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
