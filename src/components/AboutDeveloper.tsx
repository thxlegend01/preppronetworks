import { Code, Video, Palette, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  { icon: Code, label: "Coding" },
  { icon: Video, label: "Content Creation" },
  { icon: Palette, label: "Editing" },
  { icon: Sparkles, label: "And more..." },
];

const AboutDeveloper = () => {
  return (
    <section id="developer" className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">
            About <span className="text-gradient">Legend</span>
          </h2>

          <div className="p-6 md:p-8 rounded-2xl bg-card border border-border/60">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-extrabold text-primary-foreground flex-shrink-0">
                L
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-foreground mb-1">Legend</h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    11th JEE Aspirant
                  </span>
                  <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    Age 16
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate developer building PrepPro Network to make education accessible for all JEE aspirants.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              {skills.map((skill) => (
                <div key={skill.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/30 hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <skill.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
