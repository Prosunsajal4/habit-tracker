"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") || "light";
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", saved === "dark");
  }
  return saved;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
