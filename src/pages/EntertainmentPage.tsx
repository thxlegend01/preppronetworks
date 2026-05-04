import { ArrowLeft, Tv } from "lucide-react";
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

          <div className="grid gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
              >
                <div className={`p-4 bg-gradient-to-r ${app.accent} text-white`}>
                  <h2 className="text-xl font-bold">{app.title}</h2>
                  <p className="text-xs opacity-90">{app.subtitle}</p>
                </div>
                <div className="relative w-full" style={{ height: "75vh" }}>
                  <iframe
                    src={app.url}
                    title={app.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center text-xs text-muted-foreground">
                  Not loading?{" "}
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Open in new tab →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EntertainmentPage;