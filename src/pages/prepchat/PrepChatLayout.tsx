import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, PlusSquare, MessageCircle, User, ArrowLeft, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import prepproLogo from "@/assets/preppro-logo.jpg";

const TABS = [
  { to: "/prepchat/feed", icon: Home, label: "Feed" },
  { to: "/prepchat/explore", icon: Search, label: "Explore" },
  { to: "/prepchat/new", icon: PlusSquare, label: "Post" },
  { to: "/prepchat/chats", icon: MessageCircle, label: "Chats" },
  { to: "/prepchat/me", icon: User, label: "You" },
];

const PrepChatLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isThread = /^\/prepchat\/chats\/.+/.test(pathname);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <img src={prepproLogo} alt="PrepPro Network" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/40" />
        <h1 className="text-2xl font-black">PrepChat</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Post doubts, follow toppers, DM friends, join groups and channels — all inside PrepPro Network.
        </p>
        <Button onClick={() => navigate("/auth")} className="gap-2">
          <LogIn className="w-4 h-4" /> Login to continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="PrepChat — Social Study Network | PrepPro Network"
        description="Post doubts, chat 1-on-1, create study groups and follow channels on PrepChat by PrepPro Network."
        path="/prepchat"
      />

      {!isThread && (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-3">
            <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={prepproLogo} alt="" className="w-8 h-8 rounded-lg object-cover ring-1 ring-primary/40" />
            <div className="min-w-0">
              <h1 className="font-black text-lg leading-none tracking-tight">PrepChat</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">by PrepPro Network</p>
            </div>
          </div>
        </header>
      )}

      <main className={cn("flex-1 w-full", !isThread && "mx-auto max-w-2xl pb-20")}>
        <Outlet />
      </main>

      {!isThread && (
        <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-background/90 border-t border-border">
          <div className="mx-auto max-w-2xl grid grid-cols-5">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <t.icon className="w-5 h-5" strokeWidth={isActive ? 2.6 : 2} />
                    <span>{t.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="prepchat-tab"
                        className="absolute -top-px h-0.5 w-8 rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default PrepChatLayout;