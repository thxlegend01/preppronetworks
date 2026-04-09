import { useState, useEffect } from "react";
import { Smartphone, ArrowRight, Heart, Copy, Check, ArrowLeft, ChevronDown, ExternalLink, Globe, MessageCircleMore, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BATCHES, APP_ACCESS_CODES } from "@/lib/data";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import ComingSoonDialog from "@/components/ComingSoonDialog";
import CwNoticeDialog from "@/components/CwNoticeDialog";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import pwLogoNew from "@/assets/pw-logo-new.jpg";
import nexttoppersLogo from "@/assets/nexttoppers-logo.png";
import unacademyLogo from "@/assets/unacademy-logo.jpg";
import rawLogo from "@/assets/raw-logo.jpeg";
import kgsLogo from "@/assets/kgs-logo.png";
import selectionwayLogo from "@/assets/selectionway-logo.png";
import cdsLogo from "@/assets/cds-logo.png";
import revisionCourseLogo from "@/assets/revision-course-logo.jpg";
import sarvamLogo from "@/assets/sarvam-logo.jpeg";
import utkarshLogo from "@/assets/utkarsh-logo.jpeg";
import rjVikramjeetLogo from "@/assets/rj-vikramjeet-logo.png";
import careerwillLogo from "@/assets/careerwill-logo.png";
import prepproLogo from "@/assets/preppro-logo.jpg";

const logoMap: Record<string, string> = {
  "pw-app": pwLogoNew,
  "next-toppers-app": nexttoppersLogo,
  "unacademy-app": unacademyLogo,
  "vibrant-academy-app": careerwillLogo,
  "raw-app": rawLogo,
  "kgs-app": kgsLogo,
  "selection-way-app": selectionwayLogo,
  "cds-app": cdsLogo,
  "revision-course-app": revisionCourseLogo,
  "sarvam-neet-app": sarvamLogo,
  "utkarsh-app": utkarshLogo,
  "rj-vikramjeet-app": rjVikramjeetLogo,
};

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";

const AppsPage = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [cwNoticeOpen, setCwNoticeOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ url: string; title: string; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [portalNoticeOpen, setPortalNoticeOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allApps = BATCHES.filter(b => b.category === "Apps").filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return app.title.toLowerCase().includes(q) || app.description.toLowerCase().includes(q);
  });

  const featuredApps = allApps.filter(a => a.featured);
  const moreApps = allApps.filter(a => !a.featured);
  const visibleApps = searchQuery.trim() ? allApps : showAll ? allApps : featuredApps;

  const handleStudyNow = (id: string, url: string, title: string) => {
    if (url === "coming-soon") { setComingSoonOpen(true); return; }
    addToRecentlyViewed(id, title, "app");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleContinue = () => {
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

  const handlePortalClick = () => {
    setPortalNoticeOpen(true);
  };

  const renderAppCard = (app: typeof allApps[0], index: number) => {
    const appCode = APP_ACCESS_CODES[app.id];
    const isComingSoon = app.externalUrl === "coming-soon";
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
            {app.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{app.description}</p>

          <div className="space-y-2">
            {isComingSoon ? (
              <Button variant="outline" className="w-full border-muted-foreground/30 text-muted-foreground cursor-not-allowed" disabled>
                Coming Soon
              </Button>
            ) : (
              <>
                <Button variant="hero" onClick={() => handleStudyNow(app.id, app.externalUrl, app.title)} className="w-full">
                  <PlayCircle className="mr-2 w-4 h-4" />
                  Study Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500/50"
                  onClick={() => window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer")}
                >
                  <MessageCircleMore className="mr-2 w-4 h-4" />
                  WhatsApp Channel
                </Button>
              </>
            )}

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
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">PrepPro Study Apps</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              PrepPro <span className="text-gradient">Study Apps</span>
            </h1>
            <p className="text-lg text-muted-foreground">Access top educational platforms for free</p>
          </motion.div>

          {/* PrepPro Network Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={handlePortalClick}
              className="w-full group text-left p-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20 flex-shrink-0">
                  <img src={prepproLogo} alt="PrepPro Network Portal" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                      PrepPro Network Portal
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white">
                      🌐 Portal
                    </span>
                  </div>
                  <p className="text-sm text-primary font-semibold mb-0.5">All Study Portals — One Place</p>
                  <p className="text-xs text-muted-foreground">PW, Vibrant, Next Toppers & all portals in one place</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </button>
          </motion.div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search apps..." />

          {isLoading ? (
            <GridSkeleton count={4} type="card" />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                {visibleApps.map((app, index) => renderAppCard(app, index))}
              </div>

              {!searchQuery.trim() && !showAll && moreApps.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAll(true)}
                    className="gap-2 px-8 py-4 text-base font-bold border-primary/30 hover:bg-primary/10 hover:border-primary"
                  >
                    <ChevronDown className="w-5 h-5" />
                    Get More Apps ({moreApps.length}+)
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {searchQuery && allApps.length === 0 && (
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
        <ComingSoonDialog isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)} title="Coming Soon" />
        <CwNoticeDialog
          isOpen={cwNoticeOpen}
          onClose={() => setCwNoticeOpen(false)}
          onContinue={() => {
            setCwNoticeOpen(false);
            setDisclaimerOpen(true);
          }}
        />

        {/* Portal Better Experience Notice */}
        <Dialog open={portalNoticeOpen} onOpenChange={setPortalNoticeOpen}>
          <DialogContent className="sm:max-w-md glass-card border-primary/30">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg mb-4">
                <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Explore PrepPro Network 🌐
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed mt-3">
                Access all study portals in one place through the <strong className="text-primary">PrepPro Network Portal</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button
                variant="hero"
                className="w-full font-bold"
                onClick={() => {
                  setPortalNoticeOpen(false);
                  window.open("https://prepproportals.lovable.app/", "_blank", "noopener,noreferrer");
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Explore PrepPro Network
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setPortalNoticeOpen(false)}
              >
                Maybe Later
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default AppsPage;
