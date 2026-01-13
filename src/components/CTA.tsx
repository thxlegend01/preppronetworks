import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow effects - optimized for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] will-change-opacity" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto border-primary/20 animate-fade-in hover:border-primary/40 transition-colors duration-500">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8 hover-scale cursor-default" style={{ animation: 'pulse 3s ease-in-out infinite' }}>
            <Sparkles className="w-4 h-4 text-primary" style={{ animation: 'spin 3s linear infinite' }} />
            <span className="text-sm font-medium text-primary">Start Learning Today</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to <span className="text-gradient" style={{ animation: 'pulse 3s ease-in-out infinite' }}>Transform</span>
            <br />
            Your Future?
          </h2>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful students who cracked their exams with PrepPro Network. 
            Get access to all courses, tests, and community features.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero"
              size="lg" 
              className="text-lg px-10 py-7"
              onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-7 rounded-xl border-border/60 hover:bg-secondary/50 hover:border-primary/40 transition-all hover:scale-105 active:scale-95"
              onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View All Courses
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="text-foreground font-semibold animate-pulse">50,000+</span> students across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
