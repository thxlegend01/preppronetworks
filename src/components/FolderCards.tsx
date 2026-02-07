import { Smartphone, BookOpen, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const folders = [
  {
    id: "apps",
    title: "Premium Apps",
    description: "Access top educational platforms like PW, Unacademy, KGS & more",
    icon: Smartphone,
    path: "/apps",
    gradient: "from-primary/20 to-accent/10",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    count: "10+ Apps",
  },
  {
    id: "test-series",
    title: "Test Series",
    description: "Practice with Mathango, PW CBT, Kota & other top test series",
    icon: BookOpen,
    path: "/test-series",
    gradient: "from-accent/20 to-primary/10",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    count: "7+ Series",
  },
  {
    id: "study-material",
    title: "Study Material",
    description: "Notes, books, DPPs, sheets & PYQs from Allen, FIITJEE, Resonance & more",
    icon: FileText,
    path: "/study-material",
    gradient: "from-success/20 to-primary/10",
    iconBg: "bg-success/20",
    iconColor: "text-success",
    count: "50+ Resources",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Explore Resources</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            All <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need for JEE, NEET & competitive exam preparation
          </p>
        </div>

        {/* Folder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(folder.path)}
              className="cursor-pointer"
            >
              <div className={`glass-card rounded-3xl p-8 text-center h-full border border-border/50 hover:border-primary/40 transition-all duration-300 bg-gradient-to-br ${folder.gradient} group`}>
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl ${folder.iconBg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <folder.icon className={`w-10 h-10 ${folder.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {folder.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {folder.description}
                </p>

                {/* Count badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6">
                  {folder.count}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Open Folder
                  <ArrowRight className="w-4 h-4" />
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
