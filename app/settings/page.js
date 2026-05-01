"use client";

import { useState, useEffect } from "react";
import { Trash2, Download, Upload, RotateCcw } from "lucide-react";
import {
  getHabits,
  setHabits,
  getCompletions,
  setCompletions,
} from "@/lib/storage";

export default function Settings() {
  const [habits, setHabitsState] = useState([]);
  const [completions, setCompletionsState] = useState({});

  useEffect(() => {
    setHabitsState(getHabits() || []);
    setCompletionsState(getCompletions() || {});
  }, []);

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
            alert("Data imported successfully!");
          }
        } else {
          alert("Invalid backup file format.");
        }
      } catch (error) {
        alert("Error parsing backup file.");
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
        alert("All data has been cleared.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-zinc-50/30">
      <header className="bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-800 text-white shadow-2xl shadow-slate-500/20 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              SETTINGS
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Manage your data and preferences
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 p-8 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
              Data Management
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                Export Data (Backup)
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105">
                  <Upload className="w-5 h-5" strokeWidth={2.5} />
                  Import Data (Restore)
                </button>
              </div>

              <button
                onClick={handleClearAllData}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
                Clear All Data
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-500/10 p-8 border border-white/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></span>
              Manage Habits
            </h2>
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Trash2 className="w-8 h-8 text-amber-600" strokeWidth={2} />
                </div>
                <p className="text-lg font-semibold text-slate-600">
                  No habits created yet
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl hover:bg-slate-100/80 transition-all duration-200 border border-slate-200/50 hover:border-amber-300/50 group"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{habit.name}</p>
                      <p className="text-sm font-semibold text-slate-500">
                        Goal: {habit.goalDays} days/month
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-500/10 p-8 border border-white/50">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-slate-600 to-zinc-600 rounded-full"></span>
            About
          </h2>
          <div className="text-slate-600 space-y-3">
            <p className="text-lg">
              <strong className="text-slate-800">Smart Habit Tracker</strong> -
              A modern habit tracking application built with Next.js.
            </p>
            <p className="text-lg">
              <strong className="text-slate-800">Version:</strong> 1.0.0
            </p>
            <p className="text-lg">
              <strong className="text-slate-800">Data Storage:</strong> All data
              is stored locally in your browser's localStorage.
            </p>
            <div className="mt-6 p-4 bg-amber-50/80 rounded-2xl border border-amber-200/50">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tip: Regularly export your data as a backup to prevent data
                loss.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
