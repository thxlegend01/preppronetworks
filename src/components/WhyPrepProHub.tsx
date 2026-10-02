import { Brain, Target, BarChart3, BookOpen, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "Concept-Focused", description: "Strong foundations with clear explanations" },
  { icon: Target, title: "Smart Practice", description: "Focused recommendations for weak areas" },
  { icon: BarChart3, title: "Track Progress", description: "Useful analytics to monitor your growth" },
  { icon: BookOpen, title: "Exam-Oriented", description: "Curated for JEE, NEET and boards" },
  { icon: Zap, title: "100% Free", description: "No hidden charges, ever. Free forever." },
  { icon: Shield, title: "Trusted Content", description: "Resources from leading educators" },
];

const WhyPrepProHub = () => {
  return (
    <section className="py-16 md:py-24 border-y border-border/60 bg-muted/20">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="eyebrow mb-3">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Why Choose Us</span>
          </div>
          <h2 className="section-title mb-2">
            Built for focused preparation
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Everything you need for competitive exams — organized, free & effective
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative min-h-[160px] p-5 bg-card transition-colors hover:bg-secondary group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPrepProHub;
