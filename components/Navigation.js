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
    <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-3 font-semibold transition-all duration-300 relative text-sm ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" />
                  )}
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
