import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt3D from "./Tilt3D";
import MotionWrapper from "./MotionWrapper";

const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow effects - optimized for performance */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] will-change-opacity"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <MotionWrapper direction="scale" duration={0.8}>
          <Tilt3D intensity={5} scale={1.01}>
            <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto border-primary/20 hover:border-primary/40 transition-colors duration-500">
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8 cursor-default"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.2)",
                    "0 0 40px hsl(var(--primary) / 0.3)",
                    "0 0 20px hsl(var(--primary) / 0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-primary">Start Learning Today</span>
              </motion.div>
              
              {/* Heading */}
              <motion.h2 
                className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Ready to <motion.span 
                  className="text-gradient inline-block"
                  animate={{ 
                    textShadow: [
                      "0 0 20px hsl(var(--primary) / 0.3)",
                      "0 0 40px hsl(var(--primary) / 0.5)",
                      "0 0 20px hsl(var(--primary) / 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >Transform</motion.span>
                <br />
                Your Future?
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Join thousands of successful students who cracked their exams with PrepPro Network. 
                Get access to all courses, tests, and community features.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Tilt3D intensity={8} scale={1.02}>
                  <Button 
                    variant="hero"
                    size="lg" 
                    className="text-lg px-10 py-7"
                    onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started for Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Tilt3D>
                <Tilt3D intensity={8} scale={1.02}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-7 rounded-xl border-border/60 hover:bg-secondary/50 hover:border-primary/40 transition-all"
                    onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View All Courses
                  </Button>
                </Tilt3D>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div 
                className="mt-12 pt-8 border-t border-border/40"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <p className="text-sm text-muted-foreground">
                  Trusted by <motion.span 
                    className="text-foreground font-semibold"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >50,000+</motion.span> students across India
                </p>
              </motion.div>
            </div>
          </Tilt3D>
        </MotionWrapper>
      </div>
    </section>
  );
};

export default CTA;
