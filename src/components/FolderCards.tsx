import { Smartphone, BookOpen, FileText, Sparkles, Rocket, GraduationCap, ArrowRight } from "lucide-react";
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
    sticker: Rocket,
    path: "/apps",
    count: "10+",
  },
  {
    id: "test-series",
    title: "Test Series",
    tagline: "CBT Practice — Just Like Real Exams",
    description: "Mathango, PW CBT, Kota Test Series & PYQ papers",
    icon: BookOpen,
    sticker: GraduationCap,
    path: "/test-series",
    count: "7+",
  },
  {
    id: "study-material",
    title: "Study Material",
    tagline: "Every Resource You'll Ever Need",
    description: "Allen, FIITJEE, Resonance notes + Cengage, Arihant books",
    icon: FileText,
    sticker: Sparkles,
    path: "/study-material",
    count: "50+",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 120 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(section.path)}
              className="cursor-pointer group"
            >
              <div className="relative rounded-2xl p-6 border border-border/50 hover:border-primary/40 transition-all duration-300 bg-card/80 backdrop-blur-sm overflow-hidden h-full">
                <motion.div
                  className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <section.sticker className="w-10 h-10 text-primary" />
                </motion.div>

                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-primary/50 transition-all mb-4 shadow-md group-hover:scale-105">
                  <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover" />
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/15 text-primary rounded-full">
                      {section.count}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary/70 mb-1.5">{section.tagline}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{section.description}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
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
