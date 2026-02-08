import { Smartphone, BookOpen, FileText, ArrowRight, Sparkles, Rocket, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Premium Apps",
    tagline: "🚀 Top Coaching Apps — Unlocked & Free",
    description: "PW, Unacademy, KGS, UTKARSH & 7+ premium platforms at your fingertips",
    icon: Smartphone,
    sticker: Rocket,
    path: "/apps",
    gradient: "from-primary/30 via-primary/10 to-accent/5",
    borderGlow: "hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]",
    iconColor: "text-primary",
    count: "10+ Apps",
  },
  {
    id: "test-series",
    title: "Test Series",
    tagline: "📝 CBT Practice — Just Like Real Exams",
    description: "Mathango, PW CBT, Kota Test Series & PYQ papers in exam mode",
    icon: BookOpen,
    sticker: GraduationCap,
    path: "/test-series",
    gradient: "from-accent/30 via-accent/10 to-success/5",
    borderGlow: "hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.3)]",
    iconColor: "text-accent",
    count: "7+ Series",
  },
  {
    id: "study-material",
    title: "Study Material",
    tagline: "📚 Every Resource You'll Ever Need",
    description: "Allen, FIITJEE, Resonance notes + Cengage, Arihant books + DPPs & PYQs",
    icon: FileText,
    sticker: Sparkles,
    path: "/study-material",
    gradient: "from-success/30 via-success/10 to-primary/5",
    borderGlow: "hover:shadow-[0_0_30px_-5px_hsl(var(--success)/0.3)]",
    iconColor: "text-success",
    count: "50+ Resources",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <img src={prepproLogo} alt="PrepPro Network" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm font-bold text-primary tracking-wide">PrepPro Network Resources</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Your <span className="text-gradient">Study Arsenal</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything for JEE, NEET & competitive exams — organized, free, and ready to explore
          </p>
        </motion.div>

        {/* Folder Cards - Stacked Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              className="cursor-pointer"
            >
              <div className={`relative rounded-3xl p-8 md:p-10 border border-border/50 hover:border-primary/40 transition-all duration-500 bg-gradient-to-br ${section.gradient} ${section.borderGlow} glass-card overflow-hidden group`}>
                {/* Animated sticker */}
                <motion.div
                  className="absolute top-6 right-6 opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <section.sticker className={`w-16 h-16 md:w-20 md:h-20 ${section.iconColor}`} />
                </motion.div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                <div className="flex items-center gap-6 md:gap-8 relative z-10">
                  {/* Logo + Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-background/80 backdrop-blur-sm border-2 border-border/50 group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 overflow-hidden shadow-lg">
                        <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover rounded-xl" />
                      </div>
                      {/* Floating icon badge */}
                      <motion.div 
                        className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full ${section.iconColor === 'text-primary' ? 'bg-primary' : section.iconColor === 'text-accent' ? 'bg-accent' : 'bg-success'} flex items-center justify-center shadow-lg`}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <section.icon className="w-5 h-5 text-primary-foreground" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <span className="hidden md:inline-flex items-center px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full">
                        {section.count}
                      </span>
                    </div>
                    <p className="text-sm md:text-base font-semibold mb-1 opacity-80" style={{ color: `hsl(var(--${section.iconColor === 'text-primary' ? 'primary' : section.iconColor === 'text-accent' ? 'accent' : 'success'}))` }}>
                      {section.tagline}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {section.description}
                    </p>
                    <span className="md:hidden inline-flex items-center mt-2 px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full">
                      {section.count}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 hidden sm:flex">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                    </motion.div>
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
