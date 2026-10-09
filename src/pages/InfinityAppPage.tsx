import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INFINITY_APPS } from "@/lib/infinityApps";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";
import { useReducedMotion } from "framer-motion";
import InfinityTelegramStrip from "@/components/InfinityTelegramStrip";

const InfinityAppPage = ({ appId }: { appId?: string }) => {
  const params = useParams();
  const navigate = useNavigate();
  const app = INFINITY_APPS.find(item => item.id === (appId || params.appId));
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [opening, setOpening] = useState(true);
  const reducedMotion = useReducedMotion();
  const finishOpening = useCallback(() => setOpening(false), []);

  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    setOpening(true);
    const timeout = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timeout);
  }, [app?.id, attempt]);

  if (!app || app.soon) {
    return (
      <main className="fixed inset-0 grid place-items-center bg-background p-6">
        <div className="max-w-sm text-center">
          {app && <img src={app.logo} alt={app.title} className="mx-auto mb-6 h-20 w-20 rounded-lg object-cover" />}
          <h1 className="mb-3 text-2xl font-black">{app?.title || "App unavailable"}</h1>
          <p className="mb-6 flex items-center justify-center gap-2 text-muted-foreground"><Clock3 className="h-4 w-4" />{app ? "Coming soon to PrepPro Infinity" : "This app is not available."}</p>
          <Button variant="outline" onClick={() => navigate("/PrepInfinity")}><ArrowLeft className="mr-2 h-4 w-4" />PrepPro Infinity</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      {!loaded && slow && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-background p-6" aria-live="polite">
          <div className="text-center">
            <img src={app.logo} alt={app.title} className="mx-auto mb-4 h-20 w-20 rounded-lg object-cover" />
            <p className="mb-5 text-sm text-muted-foreground">{slow ? "This app is taking longer to respond." : "Preparing your classes…"}</p>
            <div className="flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={() => navigate("/PrepInfinity")}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={() => setAttempt(value => value + 1)}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></div>
          </div>
        </div>
      )}
      <iframe key={`${app.id}-${attempt}`} src={app.url} title={app.title} className="h-full w-full border-0" allow="accelerometer *; autoplay *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; fullscreen *; screen-wake-lock *; web-share *" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoaded(true)} />
      {app.telegramHeader && <InfinityTelegramStrip batches={app.id === "unacademy-batches"} />}
      {app.credit && <p className="pointer-events-none absolute bottom-0 left-0 right-0 bg-background px-3 py-1 text-center text-xs text-foreground/40">{app.credit}</p>}
      <AppLaunchAnimation open={opening && !reducedMotion} title={app.title} logo={app.logo} durationMs={1800} prefetchUrl={app.url} onComplete={finishOpening} />
    </main>
  );
};

export default InfinityAppPage;