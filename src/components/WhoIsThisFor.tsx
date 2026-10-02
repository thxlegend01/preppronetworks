import { Atom, Stethoscope, GraduationCap, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { icon: Atom, title: "JEE Aspirants", description: "Physics, Chemistry and Maths — all levels covered" },
  { icon: Stethoscope, title: "NEET Aspirants", description: "Biology, Physics and Chemistry prep materials" },
  { icon: GraduationCap, title: "Class 11–12", description: "Boards and competitive exam preparation" },
  { icon: Rocket, title: "Self-Learners", description: "Structured paths from beginner to advanced" },
];

const WhoIsThisFor = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="eyebrow mb-3">
            <span>Built for you</span>
          </div>
          <h2 className="section-title mb-2">
            One home for ambitious learners
          </h2>
          <p className="text-sm text-muted-foreground">Designed for Indian competitive exam aspirants</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-5 rounded-lg bg-card border border-border transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><a.icon className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
