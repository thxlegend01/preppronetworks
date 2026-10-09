import { Infinity, ArrowRight, Clock3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { INFINITY_APPS } from "@/lib/infinityApps";
import prepproLogo from "@/assets/preppro-logo.jpg";

const InfinityFeatured = ({ standalone = false }: { standalone?: boolean }) => {
  const navigate = useNavigate();
  return (
    <section id="infinity" className={standalone ? "mb-8 scroll-mt-24 py-7 sm:py-9" : "mb-8 scroll-mt-24 border-y border-primary/30 bg-primary/5 py-7 sm:py-9"}>
      <div className="mb-6 flex items-center gap-4">
        <img src={prepproLogo} alt="PrepPro Network" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-primary"><Infinity className="h-4 w-4" /> Our apps. One home.</p>
          {standalone ? <h1 className="text-3xl font-black text-foreground sm:text-5xl">PrepPro Infinity</h1> : <h2 className="text-3xl font-black text-foreground sm:text-4xl">PrepPro Infinity</h2>}
        </div>
      </div>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground sm:text-base">Mission Jeet, Next Topper, Unacademy, Physics Wallah and Vibrant Academy — your study apps, together in PrepPro Infinity.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {INFINITY_APPS.map(app => (
          <article key={app.id} className="flex flex-col rounded-lg border border-border bg-card p-5 sm:p-7 transition-colors hover:border-primary/50">
            <div className="mb-4 flex items-center justify-between gap-3">
              <img src={app.logo} alt={app.title} className="h-16 w-16 rounded-lg object-cover" />
              <span className={`text-xs font-semibold ${app.soon ? "text-muted-foreground" : "text-primary"}`}>{app.soon ? "Coming soon" : "Available · Free"}</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{app.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{app.description}</p>
            <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {app.details.map(detail => <span key={detail} className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-primary" />{detail}</span>)}
            </div>
            <Button variant={app.soon ? "secondary" : "hero"} size="lg" disabled={app.soon} aria-label={`Study Now — ${app.label}`} className="mt-auto h-14 w-full justify-between gap-2 text-base font-bold" onClick={() => navigate(`/PrepInfinity/${app.id}`)}>
              {app.soon ? "Coming soon" : "Study Now"}{app.soon ? <Clock3 className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </Button>
            {app.credit && <p className="mt-3 text-xs leading-relaxed text-foreground/40">{app.credit}</p>}
          </article>
        ))}
      </div>
    </section>
  );
};

export default InfinityFeatured;