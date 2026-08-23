import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import adPrepBooks from "@/assets/ad-prepbooks.jpg";
import adPrepJee from "@/assets/ad-prepjee.jpg";
import adApps from "@/assets/ad-apps.jpg";
import adPrepChat from "@/assets/ad-prepchat.jpg";
import adWhatsApp from "@/assets/ad-whatsapp.jpg";

const SLIDE_MS = 5000;
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";
const PREPBOOKS_URL = "https://prepbooks.lovable.app/";
/** 23 Aug 2026, 21:00 IST = 15:30 UTC */
const PREPBOOKS_LAUNCH = Date.UTC(2026, 7, 23, 15, 30, 0);

type Ad = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  accent: string;
  onClick?: () => void;
  href?: string;
  countdown?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

const AdCarousel = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const launched = now >= PREPBOOKS_LAUNCH;
  const remaining = Math.max(0, PREPBOOKS_LAUNCH - now);
  const hh = Math.floor(remaining / 3600000);
  const mm = Math.floor((remaining % 3600000) / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);

  const ads: Ad[] = useMemo(
    () => [
      {
        id: "prepbooks",
        tag: launched ? "LIVE NOW" : "LAUNCHING TODAY 9:00 PM",
        title: "PrepBooks is coming 🔥",
        subtitle: launched
          ? "Every book, module & PYQ set you need — now live, free forever."
          : "A brand-new PrepPro Network website packed with books, modules & PYQs. Get ready!",
        cta: launched ? "Open PrepBooks" : `Unlocks in ${pad(hh)}:${pad(mm)}:${pad(ss)}`,
        image: adPrepBooks,
        accent: "from-pink-600/70 via-fuchsia-600/40 to-transparent",
        href: launched ? PREPBOOKS_URL : undefined,
        countdown: !launched,
      },
      {
        id: "prepjee",
        tag: "PYQ MASTERY",
        title: "PrepJee — solve PYQs like a topper",
        subtitle: "Chapter-wise JEE previous year questions with instant practice.",
        cta: "Open PrepJee",
        image: adPrepJee,
        accent: "from-red-600/70 via-orange-500/35 to-transparent",
        href: "https://prepjee.lovable.app",
      },
      {
        id: "apps",
        tag: "100% FREE",
        title: "All Study Apps in one place",
        subtitle: "PW, Allen, Unacademy, Next Toppers & more — open instantly inside PrepPro.",
        cta: "Explore Apps",
        image: adApps,
        accent: "from-blue-600/70 via-indigo-600/35 to-transparent",
        onClick: () => navigate("/apps"),
      },
      {
        id: "prepchat",
        tag: "COMMUNITY",
        title: "PrepChat — doubts, DMs & toppers",
        subtitle: "Post doubts, follow aspirants, chat privately. Saurabhh is here too 🙃",
        cta: "Open PrepChat",
        image: adPrepChat,
        accent: "from-fuchsia-600/70 via-pink-600/35 to-transparent",
        onClick: () => navigate("/prepchat/feed"),
      },
      {
        id: "whatsapp",
        tag: "INSTANT UPDATES",
        title: "Join our WhatsApp Channel",
        subtitle: "Batch drops, test alerts and launch news — straight to your phone.",
        cta: "Join Free",
        image: adWhatsApp,
        accent: "from-green-600/70 via-emerald-500/35 to-transparent",
        href: WHATSAPP_LINK,
      },
      {
        id: "material",
        tag: "LIBRARY",
        title: "Study Material & Test Series",
        subtitle: "Mathongo, VOTS, modules and notes — read in-app, no downloads.",
        cta: "Browse Material",
        image: adPrepBooks,
        accent: "from-purple-600/70 via-pink-600/35 to-transparent",
        onClick: () => navigate("/study-material"),
      },
    ],
    [launched, hh, mm, ss, navigate]
  );

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % ads.length);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, [ads.length]);

  const ad = ads[index];
  const go = (dir: number) => setIndex((i) => (i + dir + ads.length) % ads.length);

  const Inner = (
    <div className="relative h-full w-full">
      <img
        src={ad.image}
        alt={ad.title}
        width={1200}
        height={628}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${ad.accent}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-4 sm:p-6">
        <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-primary/50 bg-background/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary backdrop-blur">
          {ad.countdown ? <Lock className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
          {ad.tag}
        </span>
        <h3 className="text-lg sm:text-2xl font-black leading-tight text-foreground drop-shadow">
          {ad.title}
        </h3>
        <p className="mt-1 max-w-[90%] text-[11px] sm:text-sm text-muted-foreground line-clamp-2">
          {ad.subtitle}
        </p>
        <span
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-4 h-9 text-xs font-black ${
            ad.countdown
              ? "bg-background/80 text-primary border border-primary/50 tabular-nums"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {ad.cta}
          {!ad.countdown && <ArrowRight className="h-3.5 w-3.5" />}
        </span>
      </div>
    </div>
  );

  return (
    <section
      className="container mx-auto px-4 my-5"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_18px_50px_-20px_hsl(var(--primary)/0.6)]">
        <div className="relative h-[190px] sm:h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {ad.href ? (
                <a href={ad.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {Inner}
                </a>
              ) : ad.onClick ? (
                <button onClick={ad.onClick} className="block h-full w-full text-left">
                  {Inner}
                </button>
              ) : (
                <div className="h-full">{Inner}</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* arrows */}
          <button
            aria-label="Previous ad"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur border border-border/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next ad"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur border border-border/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* progress bar */}
        <motion.div
          key={`bar-${ad.id}`}
          className="h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
        />

        {/* dots */}
        <div className="flex items-center justify-center gap-1.5 py-2.5">
          {ads.map((a, i) => (
            <button
              key={a.id}
              aria-label={`Show ad ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdCarousel;
