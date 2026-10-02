import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 border-t border-border/60">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl rounded-lg border border-primary/30 bg-secondary px-6 py-12 text-center md:px-14 md:py-16"
        >
          <div className="eyebrow mb-4 justify-center">100% free, always</div>
          <h2 className="section-title mb-3">
            Your next focused study session starts here.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Join thousands of students who cracked their exams with PrepPro Network.
          </p>

          <Button
            size="lg"
            className="rounded-md px-8 h-12 font-bold"
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
