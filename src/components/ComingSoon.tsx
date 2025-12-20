import { Rocket, Bell, Sparkles } from "lucide-react";
import edufinicLogo from "@/assets/edufinic-logo.jpg";

const ComingSoon = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-float">
            <img 
              src={edufinicLogo} 
              alt="Edufusion" 
              className="w-32 h-32 mx-auto rounded-2xl glow-primary"
            />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Edufusion</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight animate-fade-in">
            <span className="text-gradient">Stay Tuned!</span>
          </h1>
          
          {/* Rocket Icon */}
          <div className="mb-8 animate-bounce">
            <Rocket className="w-16 h-16 mx-auto text-primary" />
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in font-medium" style={{ animationDelay: "0.2s" }}>
            Site Will Be <span className="text-primary font-bold">Live Soon</span>
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            We're working hard to bring you the best JEE preparation experience. Something amazing is coming your way!
          </p>
          
          {/* Notification Card */}
          <div className="glass-card inline-flex items-center gap-3 rounded-2xl px-8 py-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Bell className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-muted-foreground font-medium">Stay connected for updates!</span>
          </div>
          
          {/* Decorative Elements */}
          <div className="mt-16 flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
            <div className="w-3 h-3 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
