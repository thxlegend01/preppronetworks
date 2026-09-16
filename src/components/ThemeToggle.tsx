import { Moon, Sun, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme, ACCENTS } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-secondary/50 transition-all overflow-hidden group"
          aria-label="Change theme"
        >
          <Palette className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          <span
            className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full"
            style={{ background: "hsl(var(--primary))" }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2">
          Appearance
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-bold border transition-colors ${
                theme === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {t === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {t === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>

        <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2">
          Colour theme
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              title={a.label}
              aria-label={a.label}
              className={`relative h-10 rounded-xl border transition-transform hover:scale-105 ${
                accent === a.id ? "border-primary ring-2 ring-primary/40" : "border-border"
              }`}
              style={{ background: `hsl(${a.swatch})` }}
            >
              {accent === a.id && (
                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground text-center">
          {ACCENTS.find((a) => a.id === accent)?.label}
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeToggle;
