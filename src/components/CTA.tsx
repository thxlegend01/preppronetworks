import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-aurora-gradient" />
      <div className="absolute inset-0 aurora-mesh opacity-30" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-aurora-primary/30 rounded-full blur-[120px] animate-aurora-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-aurora-secondary/30 rounded-full blur-[100px] animate-aurora-float" style={{ animationDelay: "1.5s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-aurora rounded-[2rem] p-10 md:p-16 text-center max-w-4xl mx-auto border border-aurora-primary/30 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-aurora-primary/20 border border-aurora-primary/40 rounded-full mb-8 backdrop-blur-sm">
            <Rocket className="w-5 h-5 text-aurora-primary animate-bounce" />
            <span className="text-sm font-semibold text-aurora-primary">Start Your Journey</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Start Your <span className="text-aurora-gradient">Preparation</span>
            <br />
            <span className="text-foreground">Today!</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful students who cracked their dream exams with PrepProHub. 
            Your success story starts here.
          </p>
          
          {/* CTA Button */}
          <Button 
            variant="aurora"
            size="xl"
            className="group hover:scale-105 transition-all duration-300 shadow-aurora text-lg"
            onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Preparation Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>
          
          {/* Trust Text */}
          <p className="mt-8 text-sm text-muted-foreground">
            <span className="text-aurora-primary font-semibold">100% Free</span> to start • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
