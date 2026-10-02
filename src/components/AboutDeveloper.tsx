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
    <section id="developer" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">The Creator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Meet <span className="text-gradient">Saurabh</span>
          </h2>
          <p className="text-sm text-muted-foreground">The mind behind PrepPro Network</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="relative p-6 md:p-8 rounded-3xl bg-card border border-border/60 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
            
            <div className="relative flex flex-col items-center text-center">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20 mb-4"
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
