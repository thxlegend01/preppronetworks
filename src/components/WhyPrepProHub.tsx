import { BookOpen, Brain, BarChart3, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Concept-Focused Learning",
    description: "Build strong foundations with clear, visual explanations. Master concepts before attempting problems.",
    gradient: "from-aurora-primary to-aurora-secondary",
    delay: "0s"
  },
  {
    icon: Target,
    title: "Smart Practice System",
    description: "AI-powered question recommendations based on your weak areas. Practice smarter, not harder.",
    gradient: "from-emerald-primary to-emerald-secondary",
    delay: "0.1s"
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Detailed analytics to track your progress. Know exactly where you stand and what to improve.",
    gradient: "from-obsidian-primary to-obsidian-secondary",
    delay: "0.2s"
  },
  {
    icon: BookOpen,
    title: "Exam-Oriented Approach",
    description: "Content curated specifically for JEE, NEET & competitive exams. Every resource aligned with exam patterns.",
    gradient: "from-aurora-accent to-aurora-primary",
    delay: "0.3s"
  }
];

const WhyPrepProHub = () => {
  return (
    <section id="why-preppro" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-aurora-primary/5 to-background" />
      <div className="absolute inset-0 aurora-mesh opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-aurora-primary/15 border border-aurora-primary/30 rounded-full mb-6 backdrop-blur-sm">
            <Brain className="w-4 h-4 text-aurora-primary" />
            <span className="text-sm font-semibold text-aurora-primary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Why <span className="text-aurora-gradient">PrepProHub</span>?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to crack competitive exams, all in one place
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-aurora rounded-3xl p-8 group hover:scale-[1.02] transition-all duration-500 animate-fade-in cursor-default"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-aurora-primary transition-colors">
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
            variant="emerald"
            size="lg"
            className="group hover:scale-105 transition-all duration-300"
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
