import { motion } from "framer-motion";
import { Trophy, Zap, ShieldCheck, Users, ArrowRight, Sparkles, Gift } from "lucide-react";

const LINK = "https://testmasterweb.vercel.app/tournament";

/**
 * Grand Test Tournament promotional banner for the homepage.
 * Zero registration fee, prizes for toppers, JEE + NEET.
 */
const TournamentPromo = () => {
  return (
    <section className="py-4 relative z-20">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.a
          href={LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          whileTap={{ scale: 0.985 }}
          className="group relative block overflow-hidden rounded-3xl ring-1 ring-amber-300/40 shadow-[0_25px_70px_-20px_rgba(234,179,8,0.55)]"
        >
          {/* Base gradient - premium royal blue → gold */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050b1f] via-[#0b1e4d] to-[#1e3a8a]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.35),transparent_55%)]" />

          {/* Diagonal sheen texture */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(120deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 22px)",
            }}
          />

          {/* Animated shine sweep */}
          <motion.div
            aria-hidden
            className="absolute -inset-y-3 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-md"
            initial={{ x: "-20%" }}
            animate={{ x: "420%" }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating trophy glow */}
          <motion.div
            aria-hidden
            className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-amber-400/25 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative p-5 sm:p-6 text-white">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[10px] font-black tracking-[0.14em] uppercase text-black shadow-md ring-1 ring-white/30">
                <Sparkles className="w-3 h-3" strokeWidth={3} />
                Grand Tournament
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[9px] font-black tracking-widest uppercase text-white ring-1 ring-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Free Entry
              </span>
            </div>

            {/* Hero row */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 bg-amber-300/40 blur-xl rounded-2xl" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 ring-1 ring-white/40 flex items-center justify-center shadow-xl">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#1a1200]" strokeWidth={2.2} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.02em] leading-[0.95] drop-shadow-sm">
                  JEE <span className="text-amber-300">&amp;</span> NEET
                  <br />
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    Mock Tournament
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 leading-snug mt-1.5">
                  Real exam pressure. Real competition. <span className="font-bold text-white">Prizes for toppers.</span>
                </p>
              </div>
            </div>

            {/* Feature chips */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Zap, label: "Zero Fee" },
                { icon: ShieldCheck, label: "Anti-Cheat" },
                { icon: Gift, label: "Cash + Rewards" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur px-2 py-2 flex flex-col items-center justify-center gap-1"
                >
                  <f.icon className="w-3.5 h-3.5 text-amber-300" strokeWidth={2.6} />
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-white/95 text-center leading-tight">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Prize strip */}
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/30 ring-1 ring-white/10 backdrop-blur px-3 py-2">
              <div className="flex -space-x-1">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 ring-2 ring-[#0b1e4d] flex items-center justify-center text-[10px] font-black text-black">1</span>
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 ring-2 ring-[#0b1e4d] flex items-center justify-center text-[10px] font-black text-black">2</span>
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 ring-2 ring-[#0b1e4d] flex items-center justify-center text-[10px] font-black text-black">3</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/90 flex-1 leading-tight">
                Top 3 win <span className="font-black text-amber-300">Cash Prizes</span> + Private Study Group + Resources.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                <Users className="w-3.5 h-3.5" />
                <span>Organised by <span className="font-black text-white">PrepPro Network</span></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#0b1e4d] text-xs font-black shadow-lg group-hover:translate-x-0.5 transition-transform">
                Join Now
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
};

export default TournamentPromo;