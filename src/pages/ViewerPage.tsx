import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Loader2, Sparkles, Rocket, Star, BookOpen, Brain, Target, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import PasswordGate from "@/components/PasswordGate";
import { BATCHES } from "@/lib/data";

// Apps that should open internally via iframe
const INTERNAL_APPS = ["next-toppers-app", "mathango-test-series"];

// Motivational quotes for loading screen
const MOTIVATIONAL_QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
];

// Fun loading tips
const LOADING_TIPS = [
  "Pro tip: Take short breaks every 45 minutes for better retention!",
  "Did you know? Active recall is more effective than passive reading.",
  "Study tip: Teaching others helps you learn faster!",
  "Fun fact: Your brain is more active at night than during the day.",
  "Remember: Consistency beats intensity in learning.",
  "Tip: Sleep is crucial for memory consolidation!",
  "Fun fact: The brain can process images 60,000x faster than text.",
  "Study hack: Use mnemonics for better memorization!",
];

// Floating icons for animation
const FloatingIcon = ({ icon: Icon, delay, duration, left, size }: { 
  icon: any; 
  delay: number; 
  duration: number; 
  left: string; 
  size: number;
}) => (
  <div
    className="absolute opacity-20 text-primary animate-float"
    style={{
      left,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      top: `${Math.random() * 100}%`,
    }}
  >
    <Icon size={size} />
  </div>
);

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";
  const appId = location.state?.appId || "";
  const openExternal = location.state?.openExternal || false;
  
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // Random quote for this session
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);
  const tip = useMemo(() => LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)], []);

  // Check if this app should open internally based on BATCHES data
  const batchData = BATCHES.find(b => b.id === appId);
  const isInternalApp = INTERNAL_APPS.includes(appId) || (batchData?.openInternal === true);
  const shouldOpenExternal = openExternal || (!isInternalApp);

  useEffect(() => {
    // Check if user already has access this session
    const access = sessionStorage.getItem("preppro_access");
    if (access === "granted") {
      setHasAccess(true);
    }
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (isLoading && hasAccess) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoading, hasAccess]);

  // Welcome message timeout
  useEffect(() => {
    if (hasAccess && !shouldOpenExternal) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, shouldOpenExternal]);

  // Open externally once access is granted (for external apps only)
  useEffect(() => {
    if (hasAccess && url && shouldOpenExternal) {
      window.open(url, "_blank");
      navigate("/");
    }
  }, [hasAccess, url, navigate, shouldOpenExternal]);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleIframeLoad = () => {
    setLoadingProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h1 className="text-xl font-bold mb-4">No URL provided</h1>
          <button 
            onClick={() => navigate("/")} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Show password gate if no access
  if (!hasAccess) {
    return (
      <PasswordGate 
        title={title}
        appId={appId}
        onSuccess={handleAccessGranted}
        onCancel={() => navigate("/")}
      />
    );
  }

  // For internal apps, show iframe
  if (!shouldOpenExternal) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header Bar */}
        <div className="h-14 glass-navbar flex items-center px-4 border-b border-border/40 relative z-20">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-secondary/50 mr-3 hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-foreground text-lg">{title}</span>
          </div>
          {isLoading && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(loadingProgress)}%</span>
            </div>
          )}
        </div>
        
        {/* Enhanced Loading Screen */}
        {isLoading && (
          <div className="absolute inset-0 top-14 z-10 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center overflow-hidden">
            {/* Floating Background Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <FloatingIcon icon={Star} delay={0} duration={6} left="10%" size={24} />
              <FloatingIcon icon={BookOpen} delay={1} duration={7} left="25%" size={32} />
              <FloatingIcon icon={Brain} delay={2} duration={5} left="40%" size={28} />
              <FloatingIcon icon={Target} delay={0.5} duration={8} left="55%" size={24} />
              <FloatingIcon icon={Zap} delay={1.5} duration={6} left="70%" size={30} />
              <FloatingIcon icon={Trophy} delay={2.5} duration={7} left="85%" size={26} />
              <FloatingIcon icon={Rocket} delay={3} duration={5} left="15%" size={28} />
              <FloatingIcon icon={Sparkles} delay={0.8} duration={6} left="60%" size={22} />
            </div>

            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="text-center relative z-10 px-6 max-w-lg">
              {/* Welcome Message with Animation */}
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

              {/* Main Loading Animation */}
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                  
                  {/* Middle ring */}
                  <div className="absolute inset-2 border-4 border-accent/20 rounded-full" />
                  <div className="absolute inset-2 border-4 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  
                  {/* Inner icon */}
                  <div className="absolute inset-4 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                    <BookOpen className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>

                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-accent rounded-full shadow-lg shadow-accent/50" />
                </div>
              </div>

              {/* Loading Text */}
              <p className="text-lg font-semibold text-foreground mb-2 animate-pulse">
                Preparing {title}...
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                {tip}
              </p>

              {/* Motivational Quote */}
              <div className="glass-card p-6 rounded-2xl border border-primary/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 text-warning fill-warning animate-pulse" 
                      style={{ animationDelay: `${i * 0.1}s` }} 
                    />
                  ))}
                </div>
                <p className="text-foreground italic mb-3 text-lg leading-relaxed">
                  &quot;{quote.text}&quot;
                </p>
                <p className="text-primary font-semibold text-sm">
                  — {quote.author}
                </p>
              </div>

              {/* Fun Stats */}
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
          <iframe
            src={url}
            className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    );
  }

  // This will briefly show while redirecting for external apps
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
