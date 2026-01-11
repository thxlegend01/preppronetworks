import { Code, Video, Palette, Sparkles, User } from "lucide-react";

const skills = [
  { icon: Code, label: "Coding" },
  { icon: Video, label: "Content Creation" },
  { icon: Palette, label: "Editing" },
  { icon: Sparkles, label: "Aur Yaad nhi baad me batata hu!" },
];

const AboutDeveloper = () => {
  return (
    <section id="developer" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 hover-scale cursor-default">
              <User className="w-4 h-4 text-primary" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
              <span className="text-sm font-medium text-primary">Meet the Developer</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              About <span className="text-gradient" style={{ animation: 'pulse 3s ease-in-out infinite' }}>Legend</span>
            </h2>
          </div>

          {/* Developer Card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-6xl md:text-7xl font-black text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-110 transition-transform duration-300">
                L
              </div>
              
              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Legend
                </h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    11th JEE Aspirant
                  </span>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    Age 16
                  </span>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  A passionate developer and content creator who believes in making education accessible to everyone. 
                  Building PrepPro Network to help fellow JEE aspirants succeed.
                </p>
                
                {/* Skills */}
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div 
                      key={skill.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-primary/20 transition-colors group cursor-default"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <skill.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{skill.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
