import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import ResourceListRow from "@/components/ResourceListRow";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";

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

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";

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
  const [launching, setLaunching] = useState<{ title: string; logo?: string; action: () => void } | null>(null);

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
    const action = () => {
      addToRecentlyViewed(id, title, "material");
      if (id === "mathango-test") { navigate("/mathango-tests"); return; }
      if (id === "vots-test") { navigate("/vots-tests"); return; }
      setSelectedApp({ url, title, id });
      setDisclaimerOpen(true);
    };
    setLaunching({ title, logo: logoMap[id], action });
  };

  const finishLaunch = () => {
    if (launching) {
      const run = launching.action;
      setLaunching(null);
      run();
    }
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Test Series · PYQs</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] uppercase">
              The Only <br />
              <span className="text-gradient">Tests</span> <br className="sm:hidden" />
              You Need.
            </h1>
            <p className="text-base text-muted-foreground mt-4 max-w-xl">
              Real-exam CBT practice, PYQs &amp; mocks — curated by PrepPro Network.
            </p>
          </motion.div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search test series..." />

          {isLoading ? (
            <GridSkeleton count={4} type="card" />
          ) : (
            <div className="mt-8 border-b border-border/50">
              <AnimatePresence>
                {testSeries.map((test, index) => (
                  <ResourceListRow
                    key={test.id}
                    index={index}
                    title={test.title}
                    subtitle={test.description}
                    logo={logoMap[test.id]}
                    isFavorite={isFavorite(test.id)}
                    isComingSoon={test.externalUrl === "coming-soon"}
                    whatsappUrl={WHATSAPP_LINK}
                    onToggleFavorite={() => toggleFavorite(test.id)}
                    onOpen={() => handleExplore(test.id, test.externalUrl, test.title)}
                  />
                ))}
              </AnimatePresence>
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

        <AppLaunchAnimation
          open={!!launching}
          title={launching?.title || ""}
          logo={launching?.logo}
          onComplete={finishLaunch}
        />
      </div>
    </PageTransition>
  );
};

export default TestSeriesPage;
