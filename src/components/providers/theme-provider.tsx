"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

type Theme = "dark" | "light";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export const ThemeProvider = ({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) => {
  // SSR-safe: inicializa como undefined y sincroniza en efecto
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  // Sincroniza el tema al montar y cuando cambia
  useEffect(() => {
    // Solo ejecuta en cliente
    if (theme === undefined) {
      let resolved: Theme = defaultTheme;
      try {
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored === "light" || stored === "dark") {
          resolved = stored;
        } else if (window.matchMedia) {
          resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
      } catch {}
      window.requestAnimationFrame(() => setTheme(resolved));
      return;
    }
    // Aplica la clase y guarda en localStorage
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme, defaultTheme]);

  // Memoiza el contexto solo si theme está definido
  const value = useMemo(() => {
    if (theme === undefined) {
      return { theme: defaultTheme, setTheme };
    }
    return { theme, setTheme };
  }, [theme, defaultTheme]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
