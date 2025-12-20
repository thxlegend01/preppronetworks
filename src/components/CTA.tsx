import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto border-primary/20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start Learning Today</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to <span className="text-gradient">Transform</span>
            <br />
            Your Future?
          </h2>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful students who cracked their exams with Edufusion. 
            Get access to all courses, tests, and community features.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-xl shadow-primary/25 group"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-7 rounded-xl border-border/60 hover:bg-secondary/50 hover:border-primary/40 transition-all"
            >
              View All Courses
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="text-foreground font-semibold">50,000+</span> students across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;