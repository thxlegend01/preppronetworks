import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-accent/20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="mb-6 animate-bounce">
            <Rocket className="w-16 h-16 mx-auto text-primary" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Start Your <span className="text-gradient">JEE Journey?</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who cracked JEE with Edufusion. 
            Get access to all courses, tests, and community features.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
              Contact Us
            </Button>
          </div>
          
          {/* Trust Badge */}
          <p className="mt-8 text-sm text-muted-foreground">
            ✨ No credit card required • Free trial available • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
