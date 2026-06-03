"use client";

import { X, Sparkles, Pencil } from "lucide-react";

export default function HabitModal({ isOpen, onClose, onSave, habit = null }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const goalDays = parseInt(formData.get("goalDays")) || 30;

    onSave({
      id: habit?.id || Date.now().toString(),
      name,
      goalDays,
      createdAt: habit?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-violet-700/20 bg-gradient-to-r from-violet-600 via-violet-600 to-fuchsia-600 dark:from-violet-700 dark:via-violet-700 dark:to-fuchsia-700">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            {habit ? (
              <Pencil className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {habit ? "Edit Habit" : "Add New Habit"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-all duration-300 hover:rotate-90"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
              Habit Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={habit?.name || ""}
              required
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-500 text-sm"
              placeholder="e.g., Exercise for 30 minutes"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
              Goal Days (per month)
            </label>
            <input
              type="number"
              name="goalDays"
              defaultValue={habit?.goalDays || 30}
              min="1"
              max="31"
              required
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-500 text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold text-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 text-sm"
            >
              {habit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
