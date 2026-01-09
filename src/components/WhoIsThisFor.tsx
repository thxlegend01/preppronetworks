import { GraduationCap, Atom, Stethoscope, Rocket, Users } from "lucide-react";

const audiences = [
  {
    icon: Atom,
    title: "JEE Aspirants",
    description: "Physics, Chemistry & Mathematics resources aligned with JEE Main & Advanced patterns",
    color: "aurora"
  },
  {
    icon: Stethoscope,
    title: "NEET Aspirants", 
    description: "Biology, Physics & Chemistry content designed for NEET-UG success",
    color: "emerald"
  },
  {
    icon: GraduationCap,
    title: "Class 11–12 Students",
    description: "Board exam preparation alongside competitive exam readiness",
    color: "obsidian"
  },
  {
    icon: Rocket,
    title: "Competitive Exam Beginners",
    description: "Start your journey with structured learning paths and foundation courses",
    color: "aurora"
  }
];

const WhoIsThisFor = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-primary/15 border border-emerald-primary/30 rounded-full mb-6 backdrop-blur-sm">
            <Users className="w-4 h-4 text-emerald-primary" />
            <span className="text-sm font-semibold text-emerald-primary">For Students</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Who is <span className="text-emerald-gradient">This For</span>?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Designed specifically for Indian competitive exam aspirants
          </p>
        </div>
        
        {/* Audience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={audience.title}
              className={`glass-${audience.color} rounded-3xl p-6 text-center group hover:scale-105 transition-all duration-500 animate-fade-in cursor-default`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-${audience.color}-primary/20 border border-${audience.color}-primary/30 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <audience.icon className={`w-8 h-8 text-${audience.color}-primary`} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-aurora-primary transition-colors">
                {audience.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
