import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!url) return;
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Timeout for slow loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [url, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
    setHasError(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadingProgress(0);
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-4">No URL provided</h1>
          <Button onClick={() => navigate("/")} variant="hero" className="hover-scale">
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
            className="hover:bg-secondary/50 hover-scale"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {hasError && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="gap-2 hover-scale"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
      </div>
      
      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 top-14 z-10 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                style={{ animationDuration: '1s' }}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Loading {title}</h3>
            <p className="text-muted-foreground mb-4">Please wait while we connect...</p>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 top-14 z-10 bg-background flex flex-col items-center justify-center">
          <div className="text-center animate-fade-in max-w-md px-4">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">Connection Slow or Failed</h3>
            <p className="text-muted-foreground mb-6">
              The website is taking too long to load. This could be due to slow internet or the site being temporarily unavailable.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} variant="hero" className="hover-scale">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="hover-scale">
                Go Back
              </Button>
            </div>
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
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
};

export default ViewerPage;
