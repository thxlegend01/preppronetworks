import { GraduationCap, Atom, Stethoscope, Rocket, Users } from "lucide-react";

const audiences = [
  {
    icon: Atom,
    title: "JEE Aspirants",
    description: "Physics, Chemistry & Mathematics resources aligned with JEE Main & Advanced patterns"
  },
  {
    icon: Stethoscope,
    title: "NEET Aspirants", 
    description: "Biology, Physics & Chemistry content designed for NEET-UG success"
  },
  {
    icon: GraduationCap,
    title: "Class 11–12 Students",
    description: "Board exam preparation alongside competitive exam readiness"
  },
  {
    icon: Rocket,
    title: "Competitive Exam Beginners",
    description: "Start your journey with structured learning paths and foundation courses"
  }
];

const WhoIsThisFor = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">For Students</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Who is <span className="text-gradient">This For</span>?
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
              className="glass-card rounded-3xl p-6 text-center group hover:scale-105 transition-all duration-500 animate-fade-in cursor-default card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20 transition-all duration-300">
                <audience.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
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
