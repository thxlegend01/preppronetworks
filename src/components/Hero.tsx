import { useState } from "react";
import { ArrowRight, Sparkles, Users, BookOpen, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: BookOpen, value: "200+", label: "Resources" },
  { icon: Trophy, value: "95%", label: "Success Rate" },
  { icon: Target, value: "10+", label: "Exams Covered" },
];

const Hero = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonId: string, targetId: string) => {
    setActiveButton(buttonId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setActiveButton(null), 500);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Royal Aurora Background */}
      <div className="absolute inset-0 bg-aurora-gradient" />
      <div className="absolute inset-0 aurora-mesh opacity-40" />
      
      {/* Animated Aurora Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-aurora-primary/20 rounded-full blur-[150px] animate-aurora-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-aurora-secondary/20 rounded-full blur-[120px] animate-aurora-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aurora-accent/15 rounded-full blur-[180px] animate-pulse" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-aurora-primary/40 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-aurora-primary/15 border border-aurora-primary/30 rounded-full mb-8 animate-fade-in backdrop-blur-sm hover:bg-aurora-primary/20 transition-all duration-300 cursor-default">
            <Sparkles className="w-4 h-4 text-aurora-primary animate-pulse" />
            <span className="text-sm font-semibold text-aurora-primary tracking-wide">India's Smart Exam Prep Platform</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">PrepProHub</span>
            <span className="text-aurora-gradient"> – Your Smart</span>
            <br className="hidden sm:block" />
            <span className="text-aurora-gradient">Companion</span>
            <span className="text-foreground"> for JEE, NEET</span>
            <br className="hidden sm:block" />
            <span className="text-foreground">& Competitive Exams</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "0.2s" }}>
            <span className="text-aurora-primary font-semibold">Concept clarity</span> • 
            <span className="text-emerald-primary font-semibold"> Smart practice</span> • 
            <span className="text-obsidian-primary font-semibold"> Real results</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              variant="aurora"
              size="xl" 
              className={`group hover:scale-105 transition-all duration-300 shadow-aurora ${activeButton === 'apps' ? 'scale-95' : ''}`}
              onClick={() => handleButtonClick('apps', 'apps')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Preparation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              variant="obsidian"
              size="xl" 
              className={`group hover:scale-105 transition-all duration-300 ${activeButton === 'features' ? 'scale-95' : ''}`}
              onClick={() => handleButtonClick('features', 'why-preppro')}
            >
              Explore Features
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="glass-aurora rounded-2xl p-4 md:p-6 group cursor-default hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-aurora-primary/20 border border-aurora-primary/30 flex items-center justify-center mb-3 mx-auto group-hover:bg-aurora-primary/30 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-aurora-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-foreground group-hover:text-aurora-primary transition-colors">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
