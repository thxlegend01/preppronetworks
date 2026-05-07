import { motion } from "framer-motion";
import { Tv, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EntertainmentPromo = () => {
  const navigate = useNavigate();
  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/entertainment")}
          className="group relative w-full text-left overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-600/20 via-purple-700/15 to-orange-500/20 p-6 md:p-8 shadow-2xl shadow-fuchsia-500/10"
        >
          {/* Glow accents */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
              <Tv className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                <Sparkles className="w-3 h-3 text-fuchsia-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-200">
                  New • Free
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight">
                Watch <span className="text-gradient">IPL Live</span> on PrepPro Entertainment
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
                Take a study break — live cricket scores, schedules &amp; highlights right inside PrepPro. No ads, no leaving the app.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Trophy className="w-3 h-3 text-orange-400" /> IPL 2026</span>
                <span>•</span>
                <span>In-app viewer</span>
                <span>•</span>
                <span className="text-fuchsia-300 font-semibold">100% Free</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white font-bold text-sm shadow-lg group-hover:shadow-fuchsia-500/40 transition-shadow shrink-0">
              Watch Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.button>
      </div>
    </section>
  );
};

export default EntertainmentPromo;
