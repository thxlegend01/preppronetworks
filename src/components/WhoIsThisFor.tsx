import { Atom, Stethoscope, GraduationCap, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { icon: Atom, title: "JEE Aspirants", description: "Physics, Chemistry & Maths" },
  { icon: Stethoscope, title: "NEET Aspirants", description: "Biology, Physics & Chemistry" },
  { icon: GraduationCap, title: "Class 11–12", description: "Boards + competitive prep" },
  { icon: Rocket, title: "Beginners", description: "Structured learning paths" },
];

const WhoIsThisFor = () => {
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
            Who is this <span className="text-gradient">for</span>?
          </h2>
          <p className="text-sm text-muted-foreground">For Indian competitive exam aspirants</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/20 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors">
                <a.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
