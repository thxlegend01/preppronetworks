import { useState, useEffect } from "react";
import { BookOpen, ArrowRight, Heart, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BATCHES } from "@/lib/data";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import ComingSoonDialog from "@/components/ComingSoonDialog";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";

import mathangoLogo from "@/assets/mathango-logo.png";
import pwLogoNew from "@/assets/pw-logo-new.jpg";
import revisionCourseLogo from "@/assets/revision-course-logo.jpg";
import votsLogo from "@/assets/vots-logo.png";

const logoMap: Record<string, string> = {
  "pw-test-series": pwLogoNew,
  "mathango-test": mathangoLogo,
  "pyq-cbt-test": revisionCourseLogo,
  "chapter-wise-test": revisionCourseLogo,
  "vots-test": votsLogo,
};

const TestSeriesPage = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState("");
  const [selectedApp, setSelectedApp] = useState<{ url: string; title: string; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const testSeries = BATCHES.filter(b => b.category === "Test Series").filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  const handleExplore = (id: string, url: string, title: string) => {
    if (url === "coming-soon") {
      setComingSoonTitle(title);
      setComingSoonOpen(true);
      return;
    }
    if (id === "mathango-test") {
      navigate("/mathango-tests");
      return;
    }
    if (id === "vots-test") {
      navigate("/vots-tests");
      return;
    }
    setSelectedApp({ url, title, id });
    setDisclaimerOpen(true);
  };

  const handleContinue = () => {
    if (selectedApp) {
      addToRecentlyViewed(selectedApp.id, selectedApp.title, "material");
      navigate(`/view/${encodeURIComponent(selectedApp.title)}`, {
        state: { url: selectedApp.url, title: selectedApp.title, appId: selectedApp.id }
      });
    }
    setDisclaimerOpen(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Test Series / PYQs</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Test Series & <span className="text-gradient">PYQs</span>
            </h1>
            <p className="text-lg text-muted-foreground">Practice with the best test series & previous year questions</p>
          </motion.div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search test series..." />

          {isLoading ? (
            <GridSkeleton count={4} type="card" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {testSeries.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="glass-card shine-effect rounded-2xl p-8 text-center group relative h-full">
                    <button
                      onClick={() => toggleFavorite(test.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
                        isFavorite(test.id) ? 'bg-destructive/20 text-destructive' : 'bg-secondary/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(test.id) ? 'fill-current' : ''}`} />
                    </button>

                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center mb-6 mx-auto bg-background shadow-lg group-hover:border-primary/50 transition-all">
                      {logoMap[test.id] ? (
                        <img src={logoMap[test.id]} alt={test.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-primary" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{test.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{test.description}</p>

                    {test.externalUrl === "coming-soon" && (
                      <div className="flex items-center gap-2 justify-center mb-4 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-xs text-warning font-medium">Tests will be added manually soon</span>
                      </div>
                    )}

                    <Button variant="hero" onClick={() => handleExplore(test.id, test.externalUrl, test.title)} className="w-full">
                      {test.externalUrl === "coming-soon" ? "Coming Soon" : "Start Practice"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {searchQuery && testSeries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No test series found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        <DisclaimerDialog
          isOpen={disclaimerOpen}
          onClose={() => setDisclaimerOpen(false)}
          onContinue={handleContinue}
          externalUrl={selectedApp?.url || ""}
          batchTitle={selectedApp?.title}
        />
        <ComingSoonDialog isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)} title={comingSoonTitle || "Mathango"} />
      </div>
    </PageTransition>
  );
};

export default TestSeriesPage;
