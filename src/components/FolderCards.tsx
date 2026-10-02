import { ArrowRight, BookOpen, FileText, Library, MessageCircle, Smartphone, Sparkles, Timer, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { openTrustedUrl } from "@/lib/urlSafety";

const sections = [
  { id: "apps", title: "Study Apps", subtitle: "PW, Unacademy, Allen and more", detail: "Premium coaching access", icon: Smartphone, path: "/apps", featured: true },
  { id: "test-series", title: "Test Series", subtitle: "CBT practice, PYQs and chapter tests", detail: "Real exam experience", icon: BookOpen, path: "/test-series" },
  { id: "prepchat", title: "PrepChat", subtitle: "Doubts, direct messages and study groups", detail: "Student community", icon: MessageCircle, path: "/prepchat" },
  { id: "study-material", title: "Study Material", subtitle: "Notes, modules and reference books", detail: "Read inside PrepPro", icon: FileText, path: "/study-material" },
  { id: "prepbooks", title: "PrepBooks", subtitle: "NCERTs, modules and reference books", detail: "Free online library", icon: Library, path: "https://prepbooks.lovable.app/", external: true },
  { id: "study-tracker", title: "Study Tracker", subtitle: "Timer, analytics, rooms and leaderboard", detail: "Build consistency", icon: Timer, path: "/study-tracker" },
  { id: "study-tools", title: "Academic Tools", subtitle: "Roadmaps, AI doubts, tests and flashcards", detail: "Six powerful tools", icon: Sparkles, path: "/study-tools" },
];

const FolderCards = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section id="apps" className="py-16 md:py-24">
      <div className="section-shell">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-3"><Zap className="h-3.5 w-3.5" /> Resource directory</div>
            <h2 className="section-title max-w-xl">Everything you need to prepare, organised.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Move between trusted study apps, focused practice, material and community tools without hunting across the web.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              type="button"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.04, duration: 0.4 }}
              onClick={() => section.external ? openTrustedUrl(section.path) : navigate(section.path)}
              className={`group min-h-[188px] text-left rounded-lg border p-5 transition-colors ${section.featured ? "border-primary/40 bg-secondary sm:col-span-2 lg:col-span-1" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex h-full flex-col">
                <div className="mb-8 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <section.icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="mt-auto">
                  <p className="mb-1 text-[10px] font-bold uppercase text-primary" style={{ letterSpacing: "0.08em" }}>{section.detail}</p>
                  <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{section.subtitle}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;