import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle } from "lucide-react";
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
    gradient: "from-pink-500/20 to-rose-500/10",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    glowColor: "shadow-pink-500/20",
  },
  {
    id: "test-series",
    title: "Test Series / PYQs",
    subtitle: "CBT Practice — Just Like Real Exams",
    description: "PW Test Series, PYQs CBT & Chapter-wise Tests",
    icon: BookOpen,
    path: "/test-series",
    count: "4",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
    glowColor: "shadow-violet-500/20",
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
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    glowColor: "shadow-emerald-500/20",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    subtitle: "Track & Boost Your Performance",
    description: "Timer, Analytics, Study Rooms & Leaderboard",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
    gradient: "from-amber-500/20 to-orange-500/10",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    glowColor: "shadow-amber-500/20",
  },
  {
    id: "prepchat",
    title: "PrepChat",
    subtitle: "Connect With Fellow Aspirants",
    description: "Real-time chat rooms, AI doubts, study groups",
    icon: MessageCircle,
    path: "/prepchat",
    count: "💬",
    gradient: "from-sky-500/20 to-blue-500/10",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-500",
    glowColor: "shadow-sky-500/20",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-20 relative">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-3">
            Explore <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Everything for JEE, NEET & competitive exams</p>
        </motion.div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              className={`group text-left p-6 rounded-2xl border border-border/40 bg-gradient-to-br ${section.gradient} backdrop-blur-sm hover:shadow-2xl ${section.glowColor} transition-all duration-500 relative overflow-hidden`}
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    {section.logo ? (
                      <img src={section.logo} alt={section.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${section.iconBg} flex items-center justify-center`}>
                        <section.icon className="w-7 h-7 text-white" />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${section.iconBg} text-white shadow-lg`}>
                    {section.count}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                  {section.title}
                </h3>
                <p className="text-sm font-semibold text-primary/80 mb-1">{section.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.description}</p>

                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
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
