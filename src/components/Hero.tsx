import { ArrowRight, Smartphone, ClipboardCheck, Library, Users, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: BookOpen, value: "200+", label: "Courses" },
  { icon: Trophy, value: "95%", label: "Success" },
];

const quickActions = [
  {
    id: "apps",
    target: "apps",
    icon: Smartphone,
    title: "Premium Apps",
    subtitle: "Top learning platforms",
    color: "from-primary to-accent",
  },
  {
    id: "test-series",
    target: "test-series",
    icon: ClipboardCheck,
    title: "Test Series",
    subtitle: "Practice like real exams",
    color: "from-primary to-accent",
  },
  {
    id: "study-material",
    target: "study-material",
    icon: Library,
    title: "Study Material",
    subtitle: "Books, PDFs & notes",
    color: "from-primary to-accent",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-12 md:pt-14 pb-8 overflow-hidden">
      {/* Soft gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/8 border border-primary/15 rounded-full mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-primary">Welcome to PrepPro Network</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={item} className="text-4xl md:text-6xl font-extrabold mb-4 leading-[1.1]">
            <span className="text-foreground">Prep like a </span>
            <span className="text-gradient">Pro</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={item} className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Access premium courses, practice tests & study materials for JEE, NEET & competitive exams — all free.
          </motion.p>

          {/* Quick Action Cards */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12 max-w-xl mx-auto">
            {quickActions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById(action.target)?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{action.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{action.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0" />
              </motion.button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex justify-center gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
