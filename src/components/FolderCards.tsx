import { Smartphone, BookOpen, FileText, Timer, MessageCircle, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WhatsAppChannelBanner from "@/components/WhatsAppChannelBanner";
import PremiumGlassCard from "@/components/PremiumGlassCard";

const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V";

const sections: Array<{
  id: string; title: string; subtitle: string; description: string;
  icon: typeof Smartphone; path: string; badge: string;
  accent: "magenta" | "purple" | "cyan" | "blend";
}> = [
  { id: "apps", title: "Study Apps", subtitle: "Premium Coaching — Free Access", description: "PW, Unacademy, Next Toppers & 10+ platforms", icon: Smartphone, path: "/apps", badge: "10+ Apps", accent: "magenta" },
  { id: "test-series", title: "Test Series", subtitle: "CBT Practice — Real Exam Feel", description: "PW Test Series, PYQs & Chapter Tests", icon: BookOpen, path: "/test-series", badge: "Live", accent: "purple" },
  { id: "study-material", title: "Study Material", subtitle: "Notes, Books & Resources", description: "Allen, FIITJEE, Resonance + Cengage, Arihant", icon: FileText, path: "/study-material", badge: "40+", accent: "cyan" },
  { id: "study-tracker", title: "Study Tracker", subtitle: "YPT Style — Track, Compete & Grow", description: "Timer, Analytics, Study Rooms, Leaderboard & Friends", icon: Timer, path: "/study-tracker", badge: "Pro", accent: "blend" },
  { id: "prepchat", title: "PrepChat", subtitle: "Connect & Discuss", description: "Chat rooms, AI doubts, study groups", icon: MessageCircle, path: "/prepchat", badge: "New", accent: "cyan" },
  { id: "study-tools", title: "PrepPro Study Tools", subtitle: "Pro Academic Toolkit", description: "Roadmap, AI Doubt Solver, Test Forge, Flashcards & more", icon: Sparkles, path: "/study-tools", badge: "AI", accent: "magenta" },
];

const FolderCards = () => {
  const navigate = useNavigate();

  return (
    <section id="apps" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur mb-4">
            <Zap className="w-3 h-3 text-fuchsia-400" />
            <span className="text-[11px] font-bold tracking-widest uppercase neon-text">Quick Access</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] mb-3 leading-[1]">
            Explore <span className="neon-text">PrepPro Network</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything for JEE, NEET & competitive exams</p>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col">
              <PremiumGlassCard
                icon={section.icon}
                title={section.title}
                subtitle={section.subtitle}
                description={section.description}
                badge={section.badge}
                accent={section.accent}
                cta="Explore Now"
                onClick={() => navigate(section.path)}
              />
              <WhatsAppChannelBanner url={WHATSAPP_LINK} label={section.title} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FolderCards;
