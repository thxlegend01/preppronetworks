import { Smartphone, BookOpen, FileText, ArrowRight, Timer, Globe, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  {
    id: "portal",
    title: "PrepPro Network Portal",
    description: "PW, Vibrant, Next Toppers & all portals in one place",
    icon: Globe,
    path: "https://pwpreppro.lovable.app/",
    count: "🌐",
    external: true,
    featured: true,
  },
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
];

const FolderCards = () => {
  const navigate = useNavigate();

  const handleClick = (section: typeof sections[0]) => {
    if (section.external) {
      window.open(section.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(section.path);
    }
  };

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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(section)}
              className={`group text-left p-6 rounded-2xl border transition-all duration-300 ${
                section.featured
                  ? "bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/25 shadow-lg shadow-primary/10 sm:col-span-2 lg:col-span-3"
                  : "bg-card border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  section.featured
                    ? "bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20"
                    : "bg-primary/8 group-hover:bg-primary/12"
                }`}>
                  <section.icon className={`w-6 h-6 ${section.featured ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  section.featured
                    ? "bg-primary/20 text-primary"
                    : "bg-primary/10 text-primary"
                }`}>
                  {section.count}
                </span>
              </div>

              <h3 className={`font-bold mb-1 group-hover:text-primary transition-colors ${
                section.featured ? "text-lg text-foreground" : "text-base text-foreground"
              }`}>
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{section.description}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                <span>{section.external ? "Open Portal" : "Explore"}</span>
                {section.external ? (
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
