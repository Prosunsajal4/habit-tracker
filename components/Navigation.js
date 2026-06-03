"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex gap-1 p-0.5 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 relative text-xs ${
                    isActive
                      ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600 dark:bg-violet-400" />
                  )}
                </Link>
              );
            })}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-400 hover:rotate-12 active:scale-95"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            aria-label="Toggle color theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 transition-transform duration-300" />
            ) : (
              <Sun className="w-4 h-4 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
