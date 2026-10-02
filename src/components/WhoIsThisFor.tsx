import { Atom, Stethoscope, GraduationCap, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { icon: Atom, title: "JEE Aspirants", description: "Physics, Chemistry & Maths — all levels covered", emoji: "⚛️", gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  { icon: Stethoscope, title: "NEET Aspirants", description: "Biology, Physics & Chemistry prep materials", emoji: "🩺", gradient: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/30" },
  { icon: GraduationCap, title: "Class 11–12", description: "Boards + competitive exam preparation", emoji: "🎓", gradient: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30" },
  { icon: Rocket, title: "Self-Learners", description: "Structured paths for beginners to advanced", emoji: "🚀", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30" },
];

const WhoIsThisFor = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <span className="text-xs font-semibold text-accent">🎯 Built For You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Who is <span className="text-gradient">PrepPro</span> for?
          </h2>
          <p className="text-sm text-muted-foreground">Designed for Indian competitive exam aspirants</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${a.gradient} border ${a.border} backdrop-blur-sm transition-all duration-300 group cursor-default`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{a.emoji}</div>
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
