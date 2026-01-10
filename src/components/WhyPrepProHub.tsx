import { BookOpen, Brain, BarChart3, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Concept-Focused Learning",
    description: "Build strong foundations with clear, visual explanations. Master concepts before attempting problems.",
    delay: "0s"
  },
  {
    icon: Target,
    title: "Smart Practice System",
    description: "AI-powered question recommendations based on your weak areas. Practice smarter, not harder.",
    delay: "0.1s"
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Detailed analytics to track your progress. Know exactly where you stand and what to improve.",
    delay: "0.2s"
  },
  {
    icon: BookOpen,
    title: "Exam-Oriented Approach",
    description: "Content curated specifically for JEE, NEET & competitive exams. Every resource aligned with exam patterns.",
    delay: "0.3s"
  }
];

const WhyPrepProHub = () => {
  return (
    <section id="why-preppro" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Why <span className="text-gradient">PrepPro Network</span>?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to crack competitive exams, all in one place
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="glass-card rounded-3xl p-8 group hover:scale-[1.02] transition-all duration-500 animate-fade-in cursor-default card-hover"
              style={{ animationDelay: feature.delay }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button 
            variant="neonPink"
            size="lg"
            onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Learning Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyPrepProHub;
