import { Brain, Target, BarChart3, BookOpen, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "Concept-Focused", description: "Strong foundations with clear explanations", color: "from-violet-500 to-purple-600" },
  { icon: Target, title: "Smart Practice", description: "AI-powered recommendations for weak areas", color: "from-rose-500 to-pink-600" },
  { icon: BarChart3, title: "Track Progress", description: "Detailed analytics to monitor your growth", color: "from-emerald-500 to-green-600" },
  { icon: BookOpen, title: "Exam-Oriented", description: "Curated for JEE, NEET & boards", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "100% Free", description: "No hidden charges, ever. Free forever.", color: "from-sky-500 to-blue-600" },
  { icon: Shield, title: "Trusted Content", description: "Verified resources from top educators", color: "from-teal-500 to-cyan-600" },
];

const WhyPrepProHub = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Why <span className="text-gradient">PrepPro Network</span>?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Everything you need for competitive exams — organized, free & effective
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 shadow-lg`}>
                <f.icon className="w-5 h-5 text-white" />
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
