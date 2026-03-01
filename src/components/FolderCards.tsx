import { Smartphone, BookOpen, FileText, ArrowRight, Timer, Sparkles, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-network-logo.jpg";
import pwLogoNew from "@/assets/pw-logo-new.jpg";
import mathangoLogo from "@/assets/mathango-logo.png";
import revisionCourseLogo from "@/assets/revision-course-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Premium Apps",
    tagline: "Top Coaching Apps — Unlocked & Free",
    description: "PW, Unacademy, Next Toppers & more premium platforms",
    icon: Smartphone,
    logo: pwLogoNew,
    path: "/apps",
    count: "10+",
    accentFrom: "from-blue-500",
    accentTo: "to-cyan-400",
    glowColor: "shadow-blue-500/25",
    borderColor: "border-blue-500/30",
    borderHover: "hover:border-blue-400",
    bgTint: "bg-blue-500/5",
    dotColor: "bg-blue-400",
  },
  {
    id: "test-series",
    title: "Test Series / PYQs",
    tagline: "CBT Practice — Just Like Real Exams",
    description: "PW Test Series, PYQs CBT & Chapter-wise Tests",
    icon: BookOpen,
    logo: mathangoLogo,
    path: "/test-series",
    count: "4",
    accentFrom: "from-violet-500",
    accentTo: "to-purple-400",
    glowColor: "shadow-violet-500/25",
    borderColor: "border-violet-500/30",
    borderHover: "hover:border-violet-400",
    bgTint: "bg-violet-500/5",
    dotColor: "bg-violet-400",
  },
  {
    id: "study-material",
    title: "Study Material",
    tagline: "Every Resource You'll Ever Need",
    description: "Allen, FIITJEE, Resonance notes + Cengage, Arihant books",
    icon: FileText,
    logo: revisionCourseLogo,
    path: "/study-material",
    count: "50+",
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-400",
    glowColor: "shadow-emerald-500/25",
    borderColor: "border-emerald-500/30",
    borderHover: "hover:border-emerald-400",
    bgTint: "bg-emerald-500/5",
    dotColor: "bg-emerald-400",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    tagline: "YPT Style — Track, Compete & Grow",
    description: "Timer, Analytics, Study Rooms, Leaderboard & Friends",
    icon: Timer,
    logo: prepproLogo,
    path: "/study-tracker",
    count: "🔥",
    accentFrom: "from-orange-500",
    accentTo: "to-rose-400",
    glowColor: "shadow-orange-500/25",
    borderColor: "border-orange-500/30",
    borderHover: "hover:border-orange-400",
    bgTint: "bg-orange-500/5",
    dotColor: "bg-orange-400",
  },
  {
    id: "preppro-world",
    title: "PrepPro Networks World",
    tagline: "Our Universe — Explore Everything",
    description: "Community, updates, announcements & exclusive content",
    icon: Globe,
    logo: prepproLogo,
    path: "/preppro-world",
    count: "🌍",
    accentFrom: "from-pink-500",
    accentTo: "to-fuchsia-400",
    glowColor: "shadow-pink-500/25",
    borderColor: "border-pink-500/30",
    borderHover: "hover:border-pink-400",
    bgTint: "bg-pink-500/5",
    dotColor: "bg-pink-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 80, damping: 14, mass: 0.8 },
  },
};

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">Explore Resources</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Your <span className="text-gradient">Study Arsenal</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Everything for JEE, NEET & competitive exams — organized & free
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.03,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(section.path)}
              className="cursor-pointer group perspective-[1000px]"
            >
              <div
                className={`relative rounded-3xl border-2 ${section.borderColor} ${section.borderHover} ${section.bgTint} transition-all duration-500 overflow-hidden h-full backdrop-blur-md group-hover:${section.glowColor} group-hover:shadow-2xl`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${section.accentFrom} ${section.accentTo}`} />
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${section.accentFrom} ${section.accentTo} rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12 group-hover:translate-x-[200%] transition-transform duration-[1200ms] ease-out" />
                </div>

                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-border/50 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-background">
                      <img src={section.logo} alt={section.title} className="w-full h-full object-cover" />
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.accentFrom} ${section.accentTo} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
                      {section.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${section.accentFrom} ${section.accentTo} text-white`}>
                      {section.count}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-primary/70 mb-2">{section.tagline}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">{section.description}</p>

                  <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r ${section.accentFrom}/10 ${section.accentTo}/10 group-hover:${section.accentFrom}/20 transition-all duration-300`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${section.dotColor} animate-pulse`} />
                    <span className="text-primary">Explore Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary ml-auto group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FolderCards;
