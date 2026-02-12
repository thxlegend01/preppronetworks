import { useState, useEffect } from "react";
import { Smartphone, ArrowRight, Heart, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BATCHES, APP_ACCESS_CODES } from "@/lib/data";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";

import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";

import pwLogo from "@/assets/pw-logo.jpg";
import rawLogo from "@/assets/raw-logo.jpeg";
import kgsLogo from "@/assets/kgs-logo.png";
import selectionwayLogo from "@/assets/selectionway-logo.png";
import nexttoppersLogo from "@/assets/nexttoppers-logo.png";
import cdsLogo from "@/assets/cds-logo.png";
import unacademyLogo from "@/assets/unacademy-logo.jpg";
import revisionCourseLogo from "@/assets/revision-course-logo.jpg";
import sarvamLogo from "@/assets/sarvam-logo.jpeg";
import utkarshLogo from "@/assets/utkarsh-logo.jpeg";
import rjVikramjeetLogo from "@/assets/rj-vikramjeet-logo.png";
import pwLogoNew from "@/assets/pw-logo-new.jpg";

const logoMap: Record<string, string> = {
  "pw-app": pwLogoNew,
  "raw-app": rawLogo,
  "kgs-app": kgsLogo,
  "selection-way-app": selectionwayLogo,
  "cds-app": cdsLogo,
  "next-toppers-app": nexttoppersLogo,
  "unacademy-app": unacademyLogo,
  "revision-course-app": revisionCourseLogo,
  "sarvam-neet-app": sarvamLogo,
  "utkarsh-app": utkarshLogo,
  "rj-vikramjeet-app": rjVikramjeetLogo,
};

const AppsPage = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ url: string; title: string; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const apps = BATCHES.filter(b => b.category === "Apps").filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return app.title.toLowerCase().includes(q) || app.description.toLowerCase().includes(q);
  });

  const handleExplore = (id: string, url: string, title: string) => {
    if (!user) { navigate("/auth"); return; }
    setSelectedApp({ url, title, id });
    setDisclaimerOpen(true);
  };

  const handleContinue = () => {
    if (selectedApp) {
      addToRecentlyViewed(selectedApp.id, selectedApp.title, "app");
      navigate(`/view/${encodeURIComponent(selectedApp.title)}`, {
        state: { url: selectedApp.url, title: selectedApp.title, appId: selectedApp.id }
      });
    }
    setDisclaimerOpen(false);
  };

  const handleCopyCode = async (appId: string) => {
    const appCode = APP_ACCESS_CODES[appId];
    if (!appCode) return;
    try {
      await navigator.clipboard.writeText(appCode.code);
      setCopiedId(appId);
      toast({ title: "Code Copied!", description: `${appCode.code} copied to clipboard` });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ variant: "destructive", title: "Failed to copy", description: "Please copy manually: " + appCode.code });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Apps</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Premium <span className="text-gradient">Apps</span>
            </h1>
            <p className="text-lg text-muted-foreground">Access top educational platforms for free</p>
          </motion.div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search apps..." />

          {isLoading ? (
            <GridSkeleton count={6} type="card" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {apps.map((app, index) => {
                const appCode = APP_ACCESS_CODES[app.id];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <div className="glass-card shine-effect rounded-2xl p-8 text-center group relative h-full">
                      <button
                        onClick={() => toggleFavorite(app.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
                          isFavorite(app.id) ? 'bg-destructive/20 text-destructive' : 'bg-secondary/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(app.id) ? 'fill-current' : ''}`} />
                      </button>

                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center mb-6 mx-auto bg-background shadow-lg group-hover:border-primary/50 transition-all">
                        {logoMap[app.id] ? (
                          <img src={logoMap[app.id]} alt={app.title} className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="w-10 h-10 text-primary" />
                        )}
                      </div>

                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {app.title.replace(" App", "")}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{app.description}</p>

                      <div className="space-y-2">
                        <Button variant="hero" onClick={() => handleExplore(app.id, app.externalUrl, app.title)} className="w-full">
                          {user ? "Explore Now" : "Login to Explore"}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>

                        {appCode && (
                          <Button
                            variant="secondary"
                            className="w-full bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30"
                            onClick={() => handleCopyCode(app.id)}
                          >
                            {copiedId === app.id ? (
                              <><Check className="mr-2 w-4 h-4" />Copied!</>
                            ) : (
                              <><Copy className="mr-2 w-4 h-4" />Code: {appCode.code}</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {searchQuery && apps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No apps found for "{searchQuery}"</p>
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
      </div>
    </PageTransition>
  );
};

export default AppsPage;
