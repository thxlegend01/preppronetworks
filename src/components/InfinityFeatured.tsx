import { Infinity, ArrowUpRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { INFINITY_APPS } from "@/lib/infinityApps";
import prepproLogo from "@/assets/preppro-logo.jpg";

const InfinityFeatured = () => {
  const navigate = useNavigate();
  return (
    <section id="infinity" className="mb-8 scroll-mt-24 border-y border-primary/30 bg-primary/5 py-7 sm:py-9">
      <div className="mb-6 flex items-center gap-4">
        <img src={prepproLogo} alt="PrepPro Network" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-primary"><Infinity className="h-4 w-4" /> Our apps. One home.</p>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">PrepPro Infinity</h2>
        </div>
      </div>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground sm:text-base">Mission Jeet, Next Topper and our upcoming Physics Wallah app — together in PrepPro Infinity.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {INFINITY_APPS.map(app => (
          <article key={app.id} className="flex flex-col rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <img src={app.logo} alt={app.title} className="h-14 w-14 rounded-lg object-cover" />
              <span className={`text-xs font-semibold ${app.soon ? "text-muted-foreground" : "text-primary"}`}>{app.soon ? "Coming soon" : "Available"}</span>
            </div>
            <h3 className="mb-1 text-lg font-bold text-foreground">{app.title}</h3>
            <p className="mb-5 text-sm text-muted-foreground">{app.soon ? "Our PW experience is on its way." : "Batches and learning resources."}</p>
            <Button variant={app.soon ? "secondary" : "hero"} disabled={app.soon} className="mt-auto w-full gap-2" onClick={() => navigate(`/infinity/${app.id}`)}>
              {app.soon ? <Clock3 className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}{app.soon ? "Coming soon" : `Open ${app.label}`}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default InfinityFeatured;