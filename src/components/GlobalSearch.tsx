import { useMemo, useState } from "react";
import { Search, X, Smartphone, BookOpen, FileText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BATCHES } from "@/lib/data";
import { studyMaterials } from "@/pages/StudyMaterialPage";
import { motion, AnimatePresence } from "framer-motion";

type Result = {
  id: string;
  title: string;
  subtitle: string;
  type: "App" | "Test Series" | "Material";
  icon: typeof Smartphone;
  onClick: () => void;
};

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];

    BATCHES.forEach((b) => {
      if (
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      ) {
        const isApp = b.category === "Apps";
        out.push({
          id: b.id,
          title: b.title,
          subtitle: b.description,
          type: isApp ? "App" : "Test Series",
          icon: isApp ? Smartphone : BookOpen,
          onClick: () => navigate(isApp ? "/apps" : "/test-series"),
        });
      }
    });

    studyMaterials.forEach((m) => {
      if (
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.class.toLowerCase().includes(q)
      ) {
        out.push({
          id: m.id,
          title: m.title,
          subtitle: `${m.subject} • ${m.class}`,
          type: "Material",
          icon: FileText,
          onClick: () => window.open(m.url, "_blank"),
        });
      }
    });

    return out.slice(0, 30);
  }, [query, navigate]);

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, test series, books, notes, modules…"
            className="pl-12 pr-10 h-14 text-base bg-card/60 backdrop-blur border-border/60 focus:border-primary/60 rounded-2xl shadow-sm"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-xl overflow-hidden"
            >
              {results.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto divide-y divide-border/40">
                  <div className="px-4 py-2 text-xs text-muted-foreground bg-secondary/40">
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </div>
                  {results.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        onClick={r.onClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {r.title}
                            </p>
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                              {r.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {r.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GlobalSearch;