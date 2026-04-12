import { useLocation } from "react-router-dom";
import { Home, LayoutGrid, FileText, BookOpen, BarChart3 } from "lucide-react";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/apps", icon: LayoutGrid, label: "Apps" },
  { path: "/test-series", icon: FileText, label: "Tests" },
  { path: "/study-material", icon: BookOpen, label: "Material" },
  { path: "/study-tracker", icon: BarChart3, label: "Tracker" },
];

const BottomNav = () => {
  const location = useLocation();

  // Hide on viewer/test pages
  if (location.pathname.startsWith("/view/") || location.pathname.startsWith("/test/")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/90 backdrop-blur-xl border-t border-border/30 px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <a
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`w-[18px] h-[18px] ${isActive ? "drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]" : ""}`} />
                <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
