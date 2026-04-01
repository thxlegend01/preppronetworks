import { Brain, Target, BarChart3, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "Concept-Focused", description: "Strong foundations with clear explanations" },
  { icon: Target, title: "Smart Practice", description: "AI-powered recommendations for weak areas" },
  { icon: BarChart3, title: "Performance", description: "Detailed analytics to track progress" },
  { icon: BookOpen, title: "Exam-Oriented", description: "Curated for JEE, NEET & boards" },
];

const WhyPrepProHub = () => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">
            Why <span className="text-gradient">PrepPro</span>?
          </h2>
          <p className="text-sm text-muted-foreground">Everything for competitive exams — free & organized</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/20 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
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
