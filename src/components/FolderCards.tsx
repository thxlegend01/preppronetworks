import { Smartphone, BookOpen, FileText, ArrowRight, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Premium Apps",
    tagline: "Top Coaching Apps — Unlocked & Free",
    description: "PW, Unacademy, KGS, UTKARSH & 7+ premium platforms",
    icon: Smartphone,
    path: "/apps",
    count: "10+",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "from-blue-500 to-cyan-500",
    borderHover: "hover:border-blue-500/50",
  },
  {
    id: "test-series",
    title: "Test Series",
    tagline: "CBT Practice — Just Like Real Exams",
    description: "Mathango, PW CBT, Kota Test Series & PYQ papers",
    icon: BookOpen,
    path: "/test-series",
    count: "7+",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "from-violet-500 to-purple-500",
    borderHover: "hover:border-violet-500/50",
  },
  {
    id: "study-material",
    title: "Study Material",
    tagline: "Every Resource You'll Ever Need",
    description: "Allen, FIITJEE, Resonance notes + Cengage, Arihant books",
    icon: FileText,
    path: "/study-material",
    count: "50+",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "from-emerald-500 to-teal-500",
    borderHover: "hover:border-emerald-500/50",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    tagline: "YPT Style — Track, Compete & Grow",
    description: "Timer, Analytics, Study Rooms, Leaderboard & Friends",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
    gradient: "from-orange-500/20 to-rose-500/20",
    iconBg: "from-orange-500 to-rose-500",
    borderHover: "hover:border-orange-500/50",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
            <img src={prepproLogo} alt="PrepPro" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">Explore Resources</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Your <span className="text-gradient">Study Arsenal</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Everything for JEE, NEET & competitive exams — organized & free
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ y: -10, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(section.path)}
              className="cursor-pointer group"
            >
              <div className={`relative rounded-2xl p-6 border border-border/50 ${section.borderHover} transition-all duration-500 bg-card/80 backdrop-blur-sm overflow-hidden h-full`}>
                {/* Background gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Shine sweep effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Icon */}
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.iconBg} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {section.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/15 text-primary rounded-full">
                        {section.count}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary/70 mb-1.5">{section.tagline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
