"use client";

import { useState, useEffect } from "react";
import { Trash2, Download, Upload, RotateCcw } from "lucide-react";
import {
  getHabits,
  setHabits,
  getCompletions,
  setCompletions,
} from "@/lib/storage";
import { toast } from "react-toastify";

export default function Settings() {
  const [habits, setHabitsState] = useState([]);
  const [completions, setCompletionsState] = useState({});

  useEffect(() => {
    setHabitsState(getHabits() || []);
    setCompletionsState(getCompletions() || {});
  }, []);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
              Data Management
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 text-base"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                Export Data (Backup)
              </button>
              <div>
                <label className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 cursor-pointer text-base">
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
              <button
                onClick={handleClearAllData}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 text-base"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
                Clear All Data
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></span>
              Manage Habits
            </h2>
            {habits.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-base text-slate-500 dark:text-slate-400">
                  No habits to manage
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-base">
                        {habit.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Goal: {habit.goalDays} days/month
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors dark:hover:bg-red-900/30 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete habit"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
