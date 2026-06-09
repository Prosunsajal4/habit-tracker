"use client";

import { useState, useEffect } from "react";
import { Trash2, Download, Upload, RotateCcw, Pencil } from "lucide-react";
import {
  getHabits,
  setHabits,
  getCompletions,
  setCompletions,
} from "@/lib/storage";
import { toast } from "react-toastify";

export default function Settings() {
  const [habits, setHabitsState] = useState(() => getHabits() || []);
  const [completions, setCompletionsState] = useState(() => getCompletions() || {});

  useEffect(() => {
    setHabits(habits);
  }, [habits]);

  useEffect(() => {
    setCompletions(completions);
  }, [completions]);

  const handleExportData = () => {
    const data = {
      habits,
      completions,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.habits && data.completions) {
          if (
            confirm("This will replace all your current data. Are you sure?")
          ) {
            setHabits(data.habits);
            setCompletions(data.completions);
            setHabitsState(data.habits);
            setCompletionsState(data.completions);
            toast.success("Data imported successfully!");
          }
        } else {
          toast.error("Invalid backup file format.");
        }
      } catch (error) {
        toast.error("Error parsing backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL data? This cannot be undone!",
      )
    ) {
      if (
        confirm(
          "This will permanently delete all your habits and completion history. Continue?",
        )
      ) {
        setHabits([]);
        setCompletions({});
        setHabitsState([]);
        setCompletionsState({});
        toast.success("All data has been cleared.");
      }
    }
  };

  const handleDeleteHabit = (habitId) => {
    if (
      confirm(
        "Are you sure you want to delete this habit and all its completion history?",
      )
    ) {
      const newHabits = habits.filter((h) => h.id !== habitId);
      const newCompletions = {};

      Object.keys(completions).forEach((dateKey) => {
        const filteredCompletions = completions[dateKey].filter(
          (id) => id !== habitId,
        );
        if (filteredCompletions.length > 0) {
          newCompletions[dateKey] = filteredCompletions;
        }
      });

      setHabits(newHabits);
      setCompletions(newCompletions);
      setHabitsState(newHabits);
      setCompletionsState(newCompletions);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-zinc-50/30 dark:from-slate-900 dark:via-gray-900/30 dark:to-zinc-900/30 transition-colors duration-300">
      <header className="bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-800 text-white shadow-2xl shadow-slate-500/20 relative overflow-hidden dark:from-slate-800 dark:via-gray-800 dark:to-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 via-white/10 to-slate-700/0"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 dark:bg-gradient-to-r dark:from-slate-200 dark:to-slate-400">
            SETTINGS
          </h1>
          <p className="text-slate-300 mt-1 text-base dark:text-slate-400">
            Manage your data and preferences
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InfoTile
            label="Habits"
            value={habits.length}
            accent="from-violet-500 to-fuchsia-500"
          />
          <InfoTile
            label="Days Tracked"
            value={Object.keys(completions).filter((k) => completions[k]?.length > 0).length}
            accent="from-emerald-500 to-teal-500"
            sub={
              (() => {
                let streak = 0;
                const d = new Date();
                while (true) {
                  const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  if (completions[k]?.length) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                  } else break;
                }
                return streak > 0 ? `🔥 ${streak} day streak` : "No streak yet";
              })()
            }
          />
          <InfoTile
            label="Total Check-ins"
            value={Object.values(completions).reduce(
              (s, arr) => s + (arr?.length || 0),
              0,
            )}
            accent="from-amber-500 to-orange-500"
          />
          <InfoTile
            label="Storage"
            value={`${(JSON.stringify({ habits, completions }).length / 1024).toFixed(1)} KB`}
            sub="Browser local storage"
            accent="from-sky-500 to-blue-500"
            bar={Math.min(100, (JSON.stringify({ habits, completions }).length / (5 * 1024 * 1024)) * 100)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
              Data Management
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                disabled={habits.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.99] text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                Export Data (Backup)
              </button>
              <div>
                <label className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.99] cursor-pointer text-base">
                  <Upload className="w-5 h-5" strokeWidth={2.5} />
                  Import Data (Restore)
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </div>
              <div className="pt-3 mt-3 border-t-2 border-dashed border-red-300 dark:border-red-900/50">
                <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Danger Zone
                </p>
                <button
                  onClick={handleClearAllData}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.99] text-base"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
                  Clear All Data
                </button>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2">
                  Permanently deletes habits and completion history.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></span>
              Manage Habits
            </h2>
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 mb-3 shadow-sm">
                  <Trash2
                    className="w-5 h-5 text-amber-600 dark:text-amber-400"
                    strokeWidth={2.5}
                  />
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-sm -z-10" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  No habits to manage
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto">
                  Add habits from the dashboard to edit or delete them here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => {
                  const totalCheckins = Object.values(completions).reduce(
                    (s, arr) =>
                      s + (arr?.includes(habit.id) ? 1 : 0),
                    0,
                  );
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600 border-l-4 border-l-violet-400 dark:border-l-violet-500"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-base truncate">
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>Goal: {habit.goalDays} d/mo</span>
                          <span className="text-slate-300 dark:text-slate-600">
                            •
                          </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {totalCheckins} check-ins
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">
                            •
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            Added {new Date(habit.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    <div className="flex items-center gap-1.5">
                    <button
                      className="p-3 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 dark:hover:bg-violet-900/30 dark:text-slate-500 dark:hover:text-violet-400"
                      title="Edit on dashboard"
                      aria-label={`Edit ${habit.name}`}
                      onClick={() => window.location.href = "/"}
                    >
                      <Pencil className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] active:scale-95 dark:hover:bg-red-900/30 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete habit"
                      aria-label={`Delete ${habit.name}`}
                    >
                        <Trash2 className="w-5 h-5" strokeWidth={2} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 pb-8 -mt-2">
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Your data lives in your browser. Export regularly to keep a backup.
        </p>
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-600 mt-1">
          {habits.length} habits · {Object.values(completions).reduce((s, a) => s + (a?.length || 0), 0)} total check-ins
        </p>
      </footer>
    </div>
  );
}

function InfoTile({ label, value, sub, accent, bar }) {
  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 p-4 overflow-hidden hover:shadow-md transition-all duration-200">
      <div
        className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-xl`}
      />
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          {sub}
        </p>
      )}
      {typeof bar === "number" && (
        <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-500`}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  );
}
