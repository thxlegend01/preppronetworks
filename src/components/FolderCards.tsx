import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import pwLogo from "@/assets/pw-logo-new.jpg";
import prepproLogo from "@/assets/preppro-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "PrepPro Study Apps",
    subtitle: "Top Coaching Apps — Unlocked & Free",
    description: "PW, Unacademy, Next Toppers & more premium platforms",
    icon: Smartphone,
    logo: pwLogo,
    path: "/apps",
    count: "10+",
    accentColor: "from-pink-400 to-rose-500",
    borderColor: "border-pink-300 dark:border-pink-500/30",
    bgTint: "bg-gradient-to-br from-pink-50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/10",
    iconBg: "bg-gradient-to-br from-pink-400 to-rose-500",
  },
  {
    id: "test-series",
    title: "Test Series / PYQs",
    subtitle: "CBT Practice — Just Like Real Exams",
    description: "PW Test Series, PYQs CBT & Chapter-wise Tests",
    icon: BookOpen,
    path: "/test-series",
    count: "4",
    accentColor: "from-violet-400 to-purple-500",
    borderColor: "border-violet-300 dark:border-violet-500/30",
    bgTint: "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-500",
  },
  {
    id: "study-material",
    title: "Study Material",
    subtitle: "Every Resource You'll Ever Need",
    description: "Allen, FIITJEE, Resonance notes + Cengage, Arihant books",
    icon: FileText,
    logo: prepproLogo,
    path: "/study-material",
    count: "50+",
    accentColor: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-300 dark:border-emerald-500/30",
    bgTint: "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    subtitle: "Track & Boost Your Performance",
    description: "Timer, Analytics, Study Rooms & Leaderboard",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
    accentColor: "from-amber-400 to-orange-500",
    borderColor: "border-amber-300 dark:border-amber-500/30",
    bgTint: "bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  {
    id: "prepchat",
    title: "PrepChat",
    subtitle: "Connect With Fellow Aspirants",
    description: "Real-time chat rooms, AI doubts, study groups",
    icon: MessageCircle,
    path: "/prepchat",
    count: "💬",
    accentColor: "from-sky-400 to-blue-500",
    borderColor: "border-sky-300 dark:border-sky-500/30",
    bgTint: "bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-sky-950/20 dark:to-blue-950/10",
    iconBg: "bg-gradient-to-br from-sky-400 to-blue-500",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-16 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-black mb-2">
            Explore <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything for JEE, NEET & competitive exams</p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 ${section.borderColor} ${section.bgTint} hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Logo or Icon */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                  {section.logo ? (
                    <img src={section.logo} alt={section.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full ${section.iconBg} flex items-center justify-center`}>
                      <section.icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                </div>

                {/* Category icon */}
                <div className={`w-12 h-12 rounded-2xl ${section.iconBg} flex items-center justify-center shadow-md opacity-80`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${section.accentColor} text-white shadow-sm`}>
                  {section.count}
                </span>
              </div>

              <p className="text-sm font-semibold text-primary mb-1">{section.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.description}</p>

              <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
