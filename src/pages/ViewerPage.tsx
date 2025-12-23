import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PasswordGate from "@/components/PasswordGate";

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user already has access this session
    const access = sessionStorage.getItem("preppro_access");
    if (access === "granted") {
      setHasAccess(true);
    }
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h1 className="text-xl font-bold mb-4">No URL provided</h1>
          <Button onClick={() => navigate("/")} variant="hero">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Show password gate if no access
  if (!hasAccess) {
    return (
      <PasswordGate 
        title={title}
        onSuccess={handleAccessGranted}
        onCancel={() => navigate("/")}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Bar */}
      <div className="h-12 glass-navbar flex items-center px-4 border-b border-border/40">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/")}
          className="hover:bg-secondary/50 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="font-semibold text-foreground">{title}</span>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-3" />}
      </div>
      
      {/* Simple Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 top-12 z-10 bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Iframe */}
      <div className="flex-1">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={handleIframeLoad}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default ViewerPage;
