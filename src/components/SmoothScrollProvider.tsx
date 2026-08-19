import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Virtual inertia smooth scrolling.
 * Native touch physics is kept on mobile (smoothTouch: false) to avoid scroll lag.
 */
const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const noop = () => {};
    window.addEventListener("scroll", noop, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", noop);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll instantly on route change
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
};

export default SmoothScrollProvider;
