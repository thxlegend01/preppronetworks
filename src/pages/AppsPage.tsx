import { useState, useEffect } from "react";
import { Smartphone, ArrowLeft, ChevronDown, ExternalLink, Globe, Copy, Check, Play, BookOpen, FileText, Radio, ShieldCheck } from "lucide-react";
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
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";
import ResourceListRow from "@/components/ResourceListRow";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import TelegramChannelBanner from "@/components/TelegramChannelBanner";
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
import vibrantLogo from "@/assets/vibrant-logo.png";
import iitschoolLogo from "@/assets/iitschool-logo.webp";
import allenLogo from "@/assets/allen-logo.png";

const logoMap: Record<string, string> = {
  "allen-app": allenLogo,
  "pw-app": pwLogoNew,
  "next-toppers-app": nexttoppersLogo,
  "unacademy-app": unacademyLogo,
  "vibrant-academy-app": vibrantLogo,
  "raw-app": rawLogo,
  "kgs-app": kgsLogo,
  "selection-way-app": selectionwayLogo,
  "cds-app": cdsLogo,
  "revision-course-app": revisionCourseLogo,
  "sarvam-neet-app": sarvamLogo,
  "utkarsh-app": utkarshLogo,
  "rj-vikramjeet-app": rjVikramjeetLogo,
  "iit-school-app": iitschoolLogo,
};

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";
const TELEGRAM_LINK = "https://t.me/+Vaaty3NWsRIzOThl";

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
  const [pwSuggestion, setPwSuggestion] = useState<{ id: string; url: string; title: string } | null>(null);
  const [launching, setLaunching] = useState<{ title: string; logo?: string; url: string; id: string; internal?: boolean; opened?: boolean } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allApps = BATCHES.filter(b => b.category === "Apps" && b.id !== "preppro-pw-app").filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return app.title.toLowerCase().includes(q) || app.description.toLowerCase().includes(q);
  });

  const featuredApps = allApps.filter(a => a.featured);
  const moreApps = allApps.filter(a => !a.featured);
  const visibleApps = searchQuery.trim() ? allApps : showAll ? allApps : featuredApps;

  const launchApp = (id: string, url: string, title: string) => {
    if (url === "coming-soon") { setComingSoonOpen(true); return; }
    addToRecentlyViewed(id, title, "app");
    const batch = BATCHES.find(b => b.id === id);
    const internal = batch?.openInternal === true;
    // Open the external tab straight away (inside the user gesture) so the app is
    // already loading in the background while the launch animation plays.
    let opened = false;
    if (!internal) {
      opened = !!window.open(url, "_blank", "noopener,noreferrer");
    }
    setLaunching({ title, logo: logoMap[id], url, id, internal, opened });
  };

  const handleStudyNow = (id: string, url: string, title: string) => {
    if (["pw-app", "pw-2-app", "pw-3-app"].includes(id)) {
      setPwSuggestion({ id, url, title });
      return;
    }
    launchApp(id, url, title);
  };

  const finishLaunch = () => {
    if (launching) {
      const target = launching;
      setLaunching(null);
      if (target.internal) {
        navigate("/viewer", { state: { url: target.url, title: target.title, appId: target.id, forceInternal: true } });
        return;
      }
      if (!target.opened) window.open(target.url, "_blank", "noopener,noreferrer");
    }
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

  const renderAppRow = (app: typeof allApps[0], index: number) => {
    const appCode = APP_ACCESS_CODES[app.id];
    const isComingSoon = app.externalUrl === "coming-soon";
    return (
      <div key={app.id}>
        <ResourceListRow
          index={index}
          title={app.title}
          subtitle={app.description}
          logo={logoMap[app.id]}
          isFavorite={isFavorite(app.id)}
          isComingSoon={isComingSoon}
          whatsappUrl={WHATSAPP_LINK}
          onToggleFavorite={() => toggleFavorite(app.id)}
          onOpen={() => handleStudyNow(app.id, app.externalUrl, app.title)}
        />
        {appCode && (
          <div className="pl-16 md:pl-32 pb-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30"
              onClick={() => handleCopyCode(app.id)}
            >
              {copiedId === app.id ? (
                <><Check className="mr-2 w-3.5 h-3.5" />Copied!</>
              ) : (
                <><Copy className="mr-2 w-3.5 h-3.5" />Access Code: {appCode.code}</>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageTransition>
      <SEO title={"Free Study Apps for JEE, NEET, NDA & CDS | PrepPro Network"} description={"Access 100+ premium study apps including PW, Allen, Unacademy, Vedantu and more — all free for JEE, NEET, NDA, CDS aspirants."} path="/apps" keywords={"study apps, JEE app, NEET app, free coaching app, PW app, Allen app"} />
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">PrepPro Study Apps</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] uppercase">
              The Only <br />
              <span className="text-gradient">Apps</span> <br className="sm:hidden" />
              You Need.
            </h1>
            <p className="text-base text-muted-foreground mt-4 max-w-xl">
              Hand-picked premium coaching platforms — tap to launch, free forever.
            </p>
          </motion.div>

          {/* PrepPro Infinity — primary featured collection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <InfinityFeatured />
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
                  <img
                    src={prepproLogo}
                    alt="PrepPro Network Portal"
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
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

          <div className="mt-6 space-y-3">
            <WhatsAppChannelBanner url={WHATSAPP_LINK} label="Study Apps Updates" />
            <TelegramChannelBanner url={TELEGRAM_LINK} label="Study Apps Updates" />
          </div>

          {isLoading ? (
            <GridSkeleton count={4} type="card" />
          ) : (
            <>
              <div className="mt-8 border-b border-border/50">
                <AnimatePresence>
                  {visibleApps.map((app, index) => renderAppRow(app, index))}
                </AnimatePresence>
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

        <AppLaunchAnimation
          open={!!launching}
          title={launching?.title || ""}
          logo={launching?.logo}
          prefetchUrl={launching?.internal ? launching?.url : undefined}
          onComplete={finishLaunch}
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

        <Dialog open={!!pwSuggestion} onOpenChange={(open) => !open && setPwSuggestion(null)}>
          <DialogContent className="sm:max-w-md border-primary/30 bg-card">
            <DialogHeader className="text-center">
              <img src={pwLogoNew} alt="Physics Wallah" className="mx-auto mb-4 h-16 w-16 rounded-2xl border border-border object-cover shadow-lg" />
              <DialogTitle className="text-xl font-black text-foreground">Try our best PW experience</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                PrepPro Physics Wallah brings classes, batches, notes and practice into one faster, full-screen app.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-3">
              <Button variant="hero" className="w-full font-bold" onClick={() => { setPwSuggestion(null); navigate("/pw"); }}>
                <Play className="mr-2 h-4 w-4 fill-current" /> Use PrepPro PW App
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const other = pwSuggestion;
                  setPwSuggestion(null);
                  if (other) launchApp(other.id, other.url, other.title);
                }}
              >
                Use Other Portal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default AppsPage;
