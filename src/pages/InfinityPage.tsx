import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import InfinityFeatured from "@/components/InfinityFeatured";
import SEO from "@/components/SEO";
import { useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";
import AppLaunchAnimation from "@/components/AppLaunchAnimation";
import prepproLogo from "@/assets/preppro-logo.jpg";

const InfinityPage = () => {
  const [opening, setOpening] = useState(true);
  const reducedMotion = useReducedMotion();
  const finishOpening = useCallback(() => setOpening(false), []);
  return (
  <main className="min-h-screen bg-background">
    <SEO title="PrepPro Infinity | Free Study Apps" description="Study with PrepPro Mission Jeet, Next Topper, Unacademy, Physics Wallah and Vibrant Academy in PrepPro Infinity." path="/PrepInfinity" />
    <Header />
    <div className="container mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6">
      <Button asChild variant="ghost" className="gap-2">
        <Link to="/"><ArrowLeft className="h-4 w-4" />Home</Link>
      </Button>
      <InfinityFeatured standalone />
    </div>
    <AppLaunchAnimation open={opening && !reducedMotion} title="PrepPro Infinity" logo={prepproLogo} durationMs={1600} onComplete={finishOpening} />
  </main>
  );
};

export default InfinityPage;