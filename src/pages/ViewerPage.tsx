import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Loader2, Sparkles, Rocket, Star, BookOpen, Brain, Target, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BATCHES } from "@/lib/data";
import { studyMaterials } from "@/pages/StudyMaterialPage";
import PdfViewer from "@/components/PdfViewer";
import { isTrustedUrl, openTrustedUrl } from "@/lib/urlSafety";

// Apps that should open internally via iframe
const INTERNAL_APPS = ["next-toppers-app", "mathango-test-series", "ipl", "allen-app", "ALLEN"];

// Motivational quotes for loading screen
const MOTIVATIONAL_QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
];

const LOADING_TIPS = [
  "Pro tip: Take short breaks every 45 minutes for better retention!",
  "Did you know? Active recall is more effective than passive reading.",
  "Study tip: Teaching others helps you learn faster!",
  "Remember: Consistency beats intensity in learning.",
  "Tip: Sleep is crucial for memory consolidation!",
  "Study hack: Use mnemonics for better memorization!",
];

const FloatingIcon = ({ icon: Icon, delay, duration, left, size }: { 
  icon: any; delay: number; duration: number; left: string; size: number;
}) => (
  <div
    className="absolute opacity-20 text-primary animate-float"
    style={{ left, animationDelay: `${delay}s`, animationDuration: `${duration}s`, top: `${Math.random() * 100}%` }}
  >
    <Icon size={size} />
  </div>
);

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const routeAppId = params.appId ? decodeURIComponent(params.appId) : "";
  const queryUrl = query.get("url") || "";
  const queryTitle = query.get("title") || "";
  const queryFileId = query.get("fileId") || "";
  const appId = location.state?.appId || routeAppId;
  const batchData = BATCHES.find(b => b.id === appId || b.title === routeAppId);
  const materialData = studyMaterials.find(m => m.id === appId || m.title === routeAppId);
  const materialFileId = materialData?.url.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1] || "";
  const materialFolderId = materialData?.url.match(/drive\.google\.com\/drive\/folders\/([^/?#]+)/)?.[1] || new URLSearchParams(materialData?.url.split("?")[1] || "").get("id") || "";
  const materialEmbedUrl = materialFileId
    ? `https://drive.google.com/file/d/${materialFileId}/preview`
    : materialFolderId
      ? `https://drive.google.com/embeddedfolderview?id=${materialFolderId}#list`
      : materialData?.url || "";
  const requestedUrl = location.state?.url || queryUrl || materialEmbedUrl || batchData?.externalUrl || "";
  const urlAllowed = isTrustedUrl(requestedUrl);
  const url = urlAllowed ? requestedUrl : "";
  const title = location.state?.title || queryTitle || materialData?.title || batchData?.title || routeAppId || "App Viewer";
  const openExternal = location.state?.openExternal || query.get("external") === "1";
  const forceInternal = location.state?.forceInternal || query.get("internal") === "1";
  const effectiveFileId = queryFileId || materialFileId;
  const pdfUrl: string | undefined = location.state?.pdfUrl || (effectiveFileId ? `https://drive.google.com/uc?export=download&id=${effectiveFileId}` : undefined);
  const pdfDownloadUrl: string | undefined = location.state?.pdfDownloadUrl || pdfUrl;
  const fallbackPdfUrl = location.state?.url || (effectiveFileId ? `https://drive.google.com/file/d/${effectiveFileId}/preview` : url);
  
  const [isLoading, setIsLoading] = useState(!pdfUrl);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);
  const tip = useMemo(() => LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)], []);

  const isInternalApp = forceInternal || INTERNAL_APPS.includes(appId) || (batchData?.openInternal === true);
  const shouldOpenExternal = openExternal || (!isInternalApp);

  // Simulate loading progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Welcome message timeout
  useEffect(() => {
    if (!shouldOpenExternal) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldOpenExternal]);

  // Open externally for external apps
  useEffect(() => {
    if (url && shouldOpenExternal) {
      openTrustedUrl(url);
      navigate("/");
    }
  }, [url, navigate, shouldOpenExternal]);

  const handleIframeLoad = () => {
    setLoadingProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  };

  if (requestedUrl && !urlAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center animate-fade-in max-w-sm">
          <h1 className="text-xl font-bold mb-2">Link blocked</h1>
          <p className="text-sm text-muted-foreground mb-4">
            This link points to a site that is not part of PrepPro Network, so it can't be opened here.
          </p>
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!url && !pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h1 className="text-xl font-bold mb-4">No URL provided</h1>
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // For internal apps, show iframe directly (no password gate)
  if (!shouldOpenExternal) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header Bar */}
        <div className="h-14 glass-navbar flex items-center px-4 border-b border-border/40 relative z-20">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-secondary/50 mr-3 hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-foreground text-lg">{title}</span>
          </div>
          {isLoading && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(loadingProgress)}%</span>
            </div>
          )}
        </div>
        
        {/* Enhanced Loading Screen */}
        {isLoading && (
          <div className="absolute inset-0 top-14 z-10 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <FloatingIcon icon={Star} delay={0} duration={6} left="10%" size={24} />
              <FloatingIcon icon={BookOpen} delay={1} duration={7} left="25%" size={32} />
              <FloatingIcon icon={Brain} delay={2} duration={5} left="40%" size={28} />
              <FloatingIcon icon={Target} delay={0.5} duration={8} left="55%" size={24} />
              <FloatingIcon icon={Zap} delay={1.5} duration={6} left="70%" size={30} />
              <FloatingIcon icon={Trophy} delay={2.5} duration={7} left="85%" size={26} />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="text-center relative z-10 px-6 max-w-lg">
              {showWelcome && (
                <div className="mb-8 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-4">
                    <Rocket className="w-5 h-5 text-primary animate-bounce" />
                    <span className="text-sm font-semibold text-primary">Welcome, Scholar!</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-pulse">
                    Let&apos;s Begin Learning!
                  </h2>
                </div>
              )}

              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-2 border-4 border-accent/20 rounded-full" />
                  <div className="absolute inset-2 border-4 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-4 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                    <BookOpen className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-2 animate-pulse">Preparing {title}...</p>
              <p className="text-sm text-muted-foreground mb-8">{tip}</p>

              <div className="glass-card p-6 rounded-2xl border border-primary/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-warning animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-foreground italic mb-3 text-lg leading-relaxed">&quot;{quote.text}&quot;</p>
                <p className="text-primary font-semibold text-sm">— {quote.author}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 glass-card rounded-xl animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  <Trophy className="w-6 h-6 text-warning mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Achievers</p>
                  <p className="font-bold text-foreground">10K+</p>
                </div>
                <div className="text-center p-3 glass-card rounded-xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="font-bold text-foreground">500+</p>
                </div>
                <div className="text-center p-3 glass-card rounded-xl animate-fade-in" style={{ animationDelay: '0.9s' }}>
                  <Star className="w-6 h-6 text-success mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-bold text-foreground">4.9★</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Iframe */}
        <div className="flex-1 relative">
          {pdfUrl ? (
            <PdfViewer
              fileUrl={pdfUrl}
              title={title}
              downloadUrl={pdfDownloadUrl}
              fallbackIframeUrl={fallbackPdfUrl}
            />
          ) : (
            <iframe
              src={url}
              className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={handleIframeLoad}
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    );
  }

  // Briefly shown while redirecting for external apps
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="text-center animate-fade-in">
        <Rocket className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
        <p className="text-xl font-semibold text-foreground mb-2">Opening {title}...</p>
        <p className="text-muted-foreground">Redirecting you to an amazing learning experience!</p>
      </div>
    </div>
  );
};

export default ViewerPage;
