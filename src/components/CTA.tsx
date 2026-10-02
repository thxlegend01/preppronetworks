import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg mx-auto text-center p-10 md:p-14 rounded-3xl glass-card pink-glow relative overflow-hidden"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl border border-primary/20" />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to <span className="text-gradient">Start</span>?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Join thousands of students who cracked their exams with PrepPro Network.
          </p>

          <Button
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground px-10 h-13 font-bold shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-500"
            onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-xs text-muted-foreground mt-8">
            Trusted by <span className="font-bold text-foreground">50,000+</span> students
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
