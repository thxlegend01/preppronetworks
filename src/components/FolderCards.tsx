import { Smartphone, BookOpen, FileText, ArrowRight, Timer, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  {
    id: "apps",
    title: "Premium Apps",
    description: "PW, Unacademy, Next Toppers & more",
    icon: Smartphone,
    path: "/apps",
    count: "10+",
  },
  {
    id: "test-series",
    title: "Test Series",
    description: "PW Tests, PYQs CBT & Chapter-wise",
    icon: BookOpen,
    path: "/test-series",
    count: "4",
  },
  {
    id: "study-material",
    title: "Study Material",
    description: "Allen, FIITJEE, Resonance notes & books",
    icon: FileText,
    path: "/study-material",
    count: "50+",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    description: "Timer, Analytics, Rooms & Leaderboard",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
  },
  {
    id: "preppro-world",
    title: "PrepPro World",
    description: "Community, updates & exclusive content",
    icon: Globe,
    path: "/preppro-world",
    count: "🌍",
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
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">
            Explore <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything for JEE, NEET & competitive exams</p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              className="group text-left p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {section.count}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{section.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
