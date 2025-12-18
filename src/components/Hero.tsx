import { BookOpen, Target, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import edufinicLogo from "@/assets/edufinic-logo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-float">
            <img 
              src={edufinicLogo} 
              alt="Edufinic" 
              className="w-28 h-28 mx-auto rounded-2xl glow-primary"
            />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Mathango 2026 Test Series</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight" style={{ animationDelay: "0.1s" }}>
            Free JEE Test Series
            <span className="block text-gradient">by Edufinic</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Practice with premium Mathango 2026 tests in CBT mode. Completely free, no sign-up required.
          </p>
          
          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#tests">
                <Target className="w-5 h-5" />
                Start Practicing Now
              </a>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">25+</div>
              <div className="text-sm text-muted-foreground mt-1">Mock Tests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">FREE</div>
              <div className="text-sm text-muted-foreground mt-1">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
