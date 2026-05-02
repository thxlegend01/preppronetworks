import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("404:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
             style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">LOST IN THE NETWORK</span>
        </div>

        <h1 className="text-[120px] sm:text-[160px] leading-none font-black tracking-tighter text-gradient mb-2">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
          This page took a study break
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The route <span className="font-mono text-foreground/80">{location.pathname}</span> doesn't exist —
          but your prep journey continues right here.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="font-bold rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold rounded-xl">
            <Link to="/apps">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Explore Apps
            </Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground/70">
          PrepPro Network • Prep Like a Pro
        </p>
      </div>
    </div>
  );
};

export default NotFound;
