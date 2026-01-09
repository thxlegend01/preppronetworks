import { Heart, Shield, Sparkles, Users, Star, Award } from "lucide-react";

const trustPoints = [
  {
    icon: Heart,
    title: "Built by Aspirants",
    subtitle: "For Aspirants",
    description: "We understand your journey because we've been there too"
  },
  {
    icon: Shield,
    title: "Made for Indian",
    subtitle: "Competitive Exams",
    description: "Content tailored specifically for JEE, NEET & more"
  },
  {
    icon: Sparkles,
    title: "Free & Safe",
    subtitle: "To Start",
    description: "No hidden charges. Start your preparation today"
  }
];

const TrustSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-obsidian-primary/5 to-background" />
      <div className="absolute inset-0 aurora-mesh opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-primary/15 border border-obsidian-primary/30 rounded-full mb-6 backdrop-blur-sm">
            <Award className="w-4 h-4 text-obsidian-primary" />
            <span className="text-sm font-semibold text-obsidian-primary">Why Trust Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Trusted by <span className="text-obsidian-gradient">50,000+</span> Students
          </h2>
        </div>
        
        {/* Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <div 
              key={point.title}
              className="glass-obsidian rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-in cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-obsidian-primary to-obsidian-secondary flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 shadow-obsidian">
                <point.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {point.title}
              </h3>
              <p className="text-aurora-primary font-semibold mb-3">
                {point.subtitle}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-primary to-aurora-secondary border-2 border-background flex items-center justify-center"
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
              ))}
            </div>
            <span className="text-muted-foreground ml-2">50K+ Active Learners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-warning fill-warning" />
              ))}
            </div>
            <span className="text-muted-foreground">4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
