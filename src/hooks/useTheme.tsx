import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type Theme = "dark" | "light";
export type Accent =
  | "pink"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "cyan"
  | "red"
  | "mono";

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: "pink", label: "Classic Pink", swatch: "340 75% 62%" },
  { id: "blue", label: "Ocean Blue", swatch: "217 91% 60%" },
  { id: "violet", label: "Royal Violet", swatch: "262 83% 63%" },
  { id: "emerald", label: "Emerald", swatch: "158 64% 42%" },
  { id: "amber", label: "Sunset Amber", swatch: "35 92% 52%" },
  { id: "cyan", label: "Aqua Cyan", swatch: "189 94% 43%" },
  { id: "red", label: "Crimson", swatch: "0 84% 60%" },
  { id: "mono", label: "Midnight Mono", swatch: "222 15% 40%" },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  const [accent, setAccent] = useState<Accent>(() => {
    const stored = localStorage.getItem("accent") as Accent;
    return ACCENTS.some((a) => a.id === stored) ? stored : "pink";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("accent", accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
