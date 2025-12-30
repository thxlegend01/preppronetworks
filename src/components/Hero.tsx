import { useState } from "react";
import { ArrowRight, Play, Users, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: BookOpen, value: "200+", label: "Courses" },
  { icon: Trophy, value: "95%", label: "Success Rate" },
];

const Hero = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonId: string, targetId: string) => {
    setActiveButton(buttonId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setActiveButton(null), 500);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-in hover-scale cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Welcome to the Future of Learning</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Prep like a Pro</span>
            <br />
            <span className="text-gradient animate-pulse">With PrepPro</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Join India's most comprehensive learning platform. Access premium batches, 
            practice tests, and expert mentorship to crack JEE, NEET, NDA & more.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              size="lg" 
              className={`text-lg px-8 py-7 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-xl shadow-primary/30 group hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 btn-click-effect ${activeButton === 'apps' ? 'scale-95 brightness-90' : ''}`}
              onClick={() => handleButtonClick('apps', 'apps')}
            >
              Explore Apps
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className={`text-lg px-8 py-7 rounded-xl bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all shadow-xl shadow-accent/30 group hover:scale-105 hover:shadow-2xl hover:shadow-accent/50 btn-click-effect ${activeButton === 'test-series' ? 'scale-95 brightness-90' : ''}`}
              onClick={() => handleButtonClick('test-series', 'test-series')}
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform" />
              Explore Test Series
            </Button>
          </div>

          {/* Study Material Shortcut */}
          <div className="flex justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <Button 
              size="lg" 
              className={`text-lg px-6 py-6 rounded-xl bg-gradient-to-r from-primary/80 via-accent to-primary/80 hover:opacity-90 transition-all shadow-lg shadow-primary/25 group hover:scale-105 hover:shadow-xl hover:shadow-primary/40 btn-click-effect ${activeButton === 'study-material' ? 'scale-95 brightness-90' : ''}`}
              onClick={() => handleButtonClick('study-material', 'study-material')}
            >
              <BookOpen className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform" />
              Explore Study Material
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="flex items-center gap-3 group cursor-default hover-scale"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-110 group-hover:border-primary/60 transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
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