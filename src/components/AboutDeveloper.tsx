import { Code, Video, Palette, Sparkles, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  { icon: Code, label: "Coding", color: "from-blue-500 to-cyan-500" },
  { icon: Video, label: "Content Creation", color: "from-rose-500 to-pink-500" },
  { icon: Palette, label: "Editing", color: "from-violet-500 to-purple-500" },
  { icon: Sparkles, label: "And more...", color: "from-amber-500 to-orange-500" },
];

const AboutDeveloper = () => {
  return (
    <section id="developer" className="py-16 md:py-24 bg-muted/20 border-y border-border/60">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="eyebrow mb-3">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">The Creator</span>
          </div>
          <h2 className="section-title mb-2">
            Meet Saurabh
          </h2>
          <p className="text-sm text-muted-foreground">The mind behind PrepPro Network</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <div className="relative p-6 md:p-8 rounded-lg bg-card border border-border overflow-hidden">
            
            <div className="relative flex flex-col items-center text-center">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-4"
              >
                S
              </motion.div>

              <h3 className="text-xl font-black text-foreground mb-2">Saurabh</h3>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-primary/15 to-primary/5 text-primary rounded-full text-xs font-bold border border-primary/20">
                  🎓 12th — JEE Aspirant
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-accent/15 to-accent/5 text-accent rounded-full text-xs font-bold border border-accent/20">
                  ⚡ Age 17
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                Passionate developer who built PrepPro Network to make quality education accessible for every aspirant across India — completely free.
              </p>

              <div className="grid grid-cols-2 gap-2.5 w-full">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-sm`}>
                      <skill.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{skill.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
