import { Atom, Stethoscope, GraduationCap, Rocket, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const audiences = [
  { icon: Atom, title: "JEE Aspirants", description: "Physics, Chemistry & Maths for JEE Main & Advanced" },
  { icon: Stethoscope, title: "NEET Aspirants", description: "Biology, Physics & Chemistry for NEET-UG" },
  { icon: GraduationCap, title: "Class 11–12", description: "Board exams + competitive exam readiness" },
  { icon: Rocket, title: "Beginners", description: "Structured learning paths & foundation courses" },
];

const WhoIsThisFor = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-14 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
            Who is <span className="text-gradient">This For</span>?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Designed for Indian competitive exam aspirants — JEE, NEET, NDA, CDS, and board exam students.
          </p>
        </motion.div>

        <div className="text-center">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? "Hide Details" : "View Details"}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {audiences.map((a, i) => (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-xl p-4 text-center group hover:scale-[1.03] transition-transform"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <a.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xs font-bold mb-1 text-foreground">{a.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-snug">{a.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
