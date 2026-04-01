import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/8 via-card to-accent/5 border border-primary/15"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to <span className="text-gradient">Start</span>?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Join thousands of students who cracked their exams with PrepPro Network.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-border/60 hover:bg-muted/50"
              onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Resources
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Trusted by <span className="font-semibold text-foreground">50,000+</span> students
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
