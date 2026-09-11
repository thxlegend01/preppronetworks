import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
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
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";
import ResourceListRow from "@/components/ResourceListRow";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";

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
      <SEO title={"Free Test Series for JEE & NEET — Mathongo, VOTS, Etoos | PrepPro Network"} description={"Practice JEE & NEET with free Mathongo QFT tests, VOTS-2 full syllabus tests, Etoos India test series and more on PrepPro Network."} path="/test-series" keywords={"JEE test series, NEET test series, mathongo tests, VOTS test, free mock tests"} />
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

          {/* PrepJee big promo banner — above test cards */}
          <motion.a
            href="https://prepjee.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.985 }}
            className="relative block mt-6 overflow-hidden rounded-3xl ring-1 ring-amber-300/40 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#f59e0b]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_55%)]" />
            <motion.div
              aria-hidden
              className="absolute -inset-y-2 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-md"
              initial={{ x: "-20%" }}
              animate={{ x: "420%" }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative p-5 sm:p-6 flex items-center gap-4 text-white">
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 ring-1 ring-white/40 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.4} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black tracking-[0.12em] uppercase ring-1 ring-white/30 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  NEW PLATFORM • FREE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-sm">
                  PrepJee
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-snug mt-0.5">
                  Free PYQs, Mathango &amp; other test series — <span className="font-bold underline underline-offset-2">prepjee.lovable.app</span>
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-orange-700 text-xs font-black shadow-md">
                Open <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <div className="sm:hidden shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-orange-700 shadow">
                <ExternalLink className="w-4 h-4" strokeWidth={2.6} />
              </div>
            </div>
          </motion.a>

          <div className="mt-6 space-y-3">
            <WhatsAppChannelBanner url={WHATSAPP_LINK} label="Test Series & PYQs" />
            <TelegramChannelBanner url={TELEGRAM_LINK} label="Test Series & PYQs" />
          </div>

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
