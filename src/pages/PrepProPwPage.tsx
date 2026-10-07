import { useCallback, useState } from "react";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";
import pwLogo from "@/assets/pw-logo-new.jpg";

const PREPPRO_PW_URL = "https://preppronetworks.pearlspark.xyz/";

const PrepProPwPage = () => {
  const [launching, setLaunching] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const finishLaunch = useCallback(() => setLaunching(false), []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      {!loaded && !launching && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-background" aria-live="polite">
          <div className="flex flex-col items-center gap-4">
            <img src={pwLogo} alt="Physics Wallah" className="h-20 w-20 rounded-2xl object-cover shadow-xl" />
            <p className="text-sm font-semibold text-muted-foreground">Preparing your classes…</p>
          </div>
        </div>
      )}

      <iframe
        src={PREPPRO_PW_URL}
        title="PrepPro Network Physics Wallah"
        className="h-full w-full border-0"
        allow="accelerometer *; autoplay *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; fullscreen *; screen-wake-lock *; web-share *"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />

      <AppLaunchAnimation
        open={launching}
        title="PrepPro Physics Wallah"
        logo={pwLogo}
        prefetchUrl={PREPPRO_PW_URL}
        durationMs={3500}
        onComplete={finishLaunch}
      />
    </main>
  );
};

export default PrepProPwPage;