import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";
  
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    // Show fallback option after 5 seconds if still loading
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [url, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setShowFallback(false);
  };

  const handleOpenExternal = () => {
    window.open(url, "_blank");
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-4">No URL provided</h1>
          <Button onClick={() => navigate("/")} variant="hero">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Bar */}
      <div className="h-14 glass-navbar flex items-center justify-between px-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-foreground">{title}</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenExternal}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open External
        </Button>
      </div>
      
      {/* Loading/Fallback Notice */}
      {showFallback && isLoading && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Loading slowly?</span> Some sites block embedding. Try opening externally.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenExternal}
            className="bg-amber-500 hover:bg-amber-600 text-white flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
      )}
      
      {/* Simple Loading Overlay */}
      {isLoading && !showFallback && (
        <div className="absolute inset-0 top-14 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading {title}...</p>
          </div>
        </div>
      )}
      
      {/* Iframe Container */}
      <div className="flex-1 relative">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default ViewerPage;
