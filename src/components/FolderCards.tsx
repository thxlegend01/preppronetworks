import { Smartphone, BookOpen, FileText, ArrowRight, Timer, MessageCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import pwLogo from "@/assets/pw-logo-new.jpg";
import prepproLogo from "@/assets/preppro-logo.jpg";

const sections = [
  {
    id: "apps",
    title: "Study Apps",
    subtitle: "Premium Coaching — Free Access",
    description: "PW, Unacademy, Next Toppers & 10+ platforms",
    icon: Smartphone,
    logo: pwLogo,
    path: "/apps",
    count: "10+",
    accent: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/8 border-rose-500/15 hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/10",
  },
  {
    id: "test-series",
    title: "Test Series",
    subtitle: "CBT Practice — Real Exam Feel",
    description: "PW Test Series, PYQs & Chapter Tests",
    icon: BookOpen,
    path: "/test-series",
    count: "4",
    accent: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/8 border-violet-500/15 hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    id: "study-material",
    title: "Study Material",
    subtitle: "Notes, Books & Resources",
    description: "Allen, FIITJEE, Resonance + Cengage, Arihant",
    icon: FileText,
    logo: prepproLogo,
    path: "/study-material",
    count: "50+",
    accent: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/8 border-emerald-500/15 hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    id: "study-tracker",
    title: "Study Tracker",
    subtitle: "Track & Boost Performance",
    description: "Timer, Analytics, Rooms & Leaderboard",
    icon: Timer,
    path: "/study-tracker",
    count: "🔥",
    accent: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/8 border-amber-500/15 hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    id: "prepchat",
    title: "PrepChat",
    subtitle: "Connect & Discuss",
    description: "Chat rooms, AI doubts, study groups",
    icon: MessageCircle,
    path: "/prepchat",
    count: "💬",
    accent: "from-sky-500 to-blue-600",
    bg: "bg-sky-500/8 border-sky-500/15 hover:border-sky-500/30",
    glow: "group-hover:shadow-sky-500/10",
  },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Quick Access</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Explore <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-sm text-muted-foreground">Everything for JEE, NEET & competitive exams</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => navigate(section.path)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group text-center p-6 rounded-2xl border ${section.bg} hover:-translate-y-1 hover:shadow-xl ${section.glow} transition-all duration-300 animate-fade-in flex flex-col items-center`}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-card border-2 border-border shadow-md mb-4 flex items-center justify-center">
                {section.logo ? (
                  <img src={section.logo} alt={section.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${section.accent} flex items-center justify-center`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">{section.subtitle}</p>
              <p className="text-xs text-muted-foreground/80 mb-5 line-clamp-2">{section.description}</p>

              <div className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${section.accent} text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all`}>
                Explore Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
