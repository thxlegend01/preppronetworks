import { ArrowLeft, Tv, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const apps = [
  {
    id: "ipl",
    title: "IPL Live",
    subtitle: "Cricket scores, schedule & highlights",
    url: "https://testingsportsweb.vercel.app",
    accent: "from-fuchsia-500 to-orange-500",
  },
];

const EntertainmentPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Tv className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Entertainment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              PrepPro <span className="text-gradient">Entertainment</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Take a break — refresh your mind between study sessions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() =>
                  navigate("/viewer", {
                    state: { url: app.url, title: app.title, appId: app.id },
                  })
                }
                className="text-left rounded-2xl border border-border bg-card overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
              >
                <div className={`p-6 bg-gradient-to-r ${app.accent} text-white relative`}>
                  <h2 className="text-2xl font-black">{app.title}</h2>
                  <p className="text-sm opacity-90 mt-1">{app.subtitle}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                    <Play className="w-3 h-3 fill-current" /> Open Now
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EntertainmentPage;