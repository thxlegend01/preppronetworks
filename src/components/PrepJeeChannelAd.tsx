import { motion } from "framer-motion";
import { BadgeCheck, Send, Share2, Forward } from "lucide-react";
import adPrepJee from "@/assets/ad-prepjee.jpg";

const CHANNEL_LINK = "https://t.me/PrepProBot";

const PROBLEMS: { bad: string; good: string }[] = [
  { bad: "PYQs scattered everywhere, no proper chapter-wise?", good: "JEE Mains + Advanced + Chapter-wise PYQs" },
  { bad: "Only reading PYQs, no exam feel?", good: "Practice + Test Mode + Build Custom Test + Real NTA Type CBT Mode" },
  { bad: "No good Test Series?", good: "Allen Tests (5 Test Series) + Mathongo Tests (2026 & April/July 2027)" },
  { bad: "Need personal help, formulas, dashboard?", good: "Personal Support — Jo chahiye personally mil jayega" },
  { bad: "Books too costly?", good: "PrepBooks (All JEE Books) + PW Batches (JEE Oriented)" },
  { bad: "Don't know your Rank & Percentile?", good: "Test Tracker + Syllabus & Prep Tracker + Mistake Book" },
  { bad: "Forgetting formulas?", good: "Flash Cards & Formulas" },
  { bad: "No one to clear doubts?", good: "Chat Support + Sunday Tournament with Prize" },
];

const BASIC_ITEMS = [
  "JEE Mains PYQs",
  "Advanced PYQs",
  "Chapter-wise PYQs",
  "Practice + Test Mode",
  "Custom Test",
  "Allen Tests",
  "Mathongo Tests",
  "NTA CBT Mode",
];

const PREMIUM_EXTRA = [
  "Personal Support",
  "PrepBooks",
  "PW Batches",
  "Test Tracker",
  "Syllabus Tracker",
  "Mistake Book",
  "Flash Cards",
  "Chat Support",
  "Sunday Tournament",
];

/**
 * PrepJee launch offer rendered as a Telegram channel post.
 * Content mirrors the official channel broadcast so students see the
 * exact message that goes out on Telegram.
 */
const PrepJeeChannelAd = () => {
  return (
    <section className="py-4 relative z-20">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.a
          href={CHANNEL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          whileTap={{ scale: 0.985 }}
          className="group relative block overflow-hidden rounded-3xl ring-1 ring-primary/30 shadow-[0_25px_70px_-20px_hsl(var(--primary)/0.55)]"
          aria-label="PrepJee Jan 2027 Pass offer — contact @PrepProBot on Telegram"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(120deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 22px)",
            }}
          />

          <div className="relative p-4 sm:p-5 text-foreground">
            {/* Channel header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={adPrepJee}
                  alt="PrepJee"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/50"
                  loading="lazy"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 ring-2 ring-card">
                  <Send className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-bold">PrepJee — PrepPro Network</span>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-sky-400" />
                </div>
                <span className="text-[11px] text-muted-foreground">channel · official PrepPro broadcasts</span>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Today, 19:43</span>
            </div>

            {/* Message body */}
            <div className="rounded-2xl rounded-tl-md border border-border/70 bg-card/90 backdrop-blur px-4 py-4">
              <h3 className="text-base sm:text-lg font-black leading-snug">
                🔥 <span className="text-primary">PrepJee</span> — JEE Mains Jan 2027 Pass
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-foreground/80 font-medium">
                Facing these problems in your JEE prep?
              </p>

              <div className="mt-3 space-y-2.5">
                {PROBLEMS.map((p, i) => (
                  <div key={i} className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                    <p className="flex items-start gap-2 text-[11px] sm:text-xs text-muted-foreground">
                      <span aria-hidden className="shrink-0">❌</span>
                      <span className="line-through decoration-red-500/50">{p.bad}</span>
                    </p>
                    <p className="mt-1 flex items-start gap-2 text-[11px] sm:text-xs font-bold">
                      <span aria-hidden className="shrink-0">✅</span>
                      <span>{p.good}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Plans */}
              <p className="mt-4 text-xs sm:text-sm font-bold">
                We have <span className="text-primary">2 Plans</span>, Both Valid Till January Attempt:
              </p>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs font-black">✅ BASIC — <span className="text-primary">₹120</span></p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Essential</p>
                  <ul className="mt-2 space-y-1">
                    {BASIC_ITEMS.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                        <span aria-hidden className="text-primary shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-xl border-2 border-primary/60 bg-background/70 p-3 shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.6)]">
                  <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary-foreground shadow">
                    Most Popular
                  </span>
                  <p className="text-xs font-black">⭐ PREMIUM — <span className="text-primary">₹200</span></p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Everything in Basic, plus</p>
                  <ul className="mt-2 space-y-1">
                    {PREMIUM_EXTRA.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                        <span aria-hidden className="text-primary shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extra benefit */}
              <div className="mt-3 rounded-xl border border-amber-300/40 bg-amber-400/10 px-3 py-2.5">
                <p className="text-[11px] sm:text-xs font-bold">🎁 Extra Benefit with ₹200 Plan:</p>
                <p className="mt-1 text-[11px] sm:text-xs text-foreground/85">
                  April Attempt = Only <span className="font-bold text-primary">₹100</span> extra (Otherwise ₹200)
                </p>
                <p className="text-[11px] sm:text-xs text-foreground/85">
                  JEE Advanced = Only <span className="font-bold text-primary">₹200</span> extra (Otherwise ₹300)
                </p>
              </div>

              <p className="mt-3 text-[11px] sm:text-xs font-bold">
                To Purchase Jan 2027 Pass, Contact on Telegram:{" "}
                <span className="text-primary">@PrepProBot</span>
              </p>

              {/* Reactions + forward, Telegram style */}
              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[11px]" aria-hidden>🔥</span>
                  <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[11px]" aria-hidden>❤️</span>
                  <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[11px]" aria-hidden>👍</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Forward className="h-4 w-4" aria-hidden />
                  <Share2 className="h-3.5 w-3.5" aria-hidden />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-4 h-11 text-xs font-black text-primary-foreground shadow-lg transition-transform group-hover:scale-[1.02]">
              <Send className="h-4 w-4" />
              Buy on Telegram — @PrepProBot
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
};

export default PrepJeeChannelAd;
