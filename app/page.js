"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, TrendingUp, TrendingDown, Eraser } from "lucide-react";
import DonutChart from "@/components/DonutChart";
import LineChartComponent from "@/components/LineChart";
import HabitGrid from "@/components/HabitGrid";
import HabitModal from "@/components/HabitModal";
import {
  getHabits,
  setHabits,
  getCompletions,
  setCompletions,
  getSelectedMonth,
  setSelectedMonth,
} from "@/lib/storage";
import {
  getDaysInMonth,
  calculateCompletionRate,
  getMonthName,
} from "@/lib/utils";
import { toast } from "react-toastify";

export default function Home() {
  const [habits, setHabitsState] = useState([]);
  const [completions, setCompletionsState] = useState({});
  const [selectedMonth, setSelectedMonthState] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  useEffect(() => {
    const storedHabits = getHabits();
    const storedCompletions = getCompletions();
    const storedMonth = getSelectedMonth();

    if (storedHabits) setHabitsState(storedHabits);
    if (storedCompletions) setCompletionsState(storedCompletions);
    if (storedMonth) setSelectedMonthState(storedMonth);
  }, []);

  useEffect(() => {
    setHabits(habits);
  }, [habits]);

  useEffect(() => {
    setCompletions(completions);
  }, [completions]);

  useEffect(() => {
    setSelectedMonth(selectedMonth.year, selectedMonth.month);
  }, [selectedMonth]);

  const handleToggleCompletion = (habitId, day) => {
    const dateKey = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setCompletionsState((prev) => {
      const newCompletions = { ...prev };
      if (!newCompletions[dateKey]) {
        newCompletions[dateKey] = [];
      }

      const index = newCompletions[dateKey].indexOf(habitId);
      if (index > -1) {
        newCompletions[dateKey].splice(index, 1);
      } else {
        newCompletions[dateKey].push(habitId);
      }

      return newCompletions;
    });
  };

  const handleSaveHabit = (habit) => {
    if (editingHabit) {
      setHabitsState((prev) =>
        prev.map((h) => (h.id === habit.id ? habit : h)),
      );
    } else {
      setHabitsState((prev) => [...prev, habit]);
    }
    setShowModal(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      setHabitsState((prev) => prev.filter((h) => h.id !== habitId));
      toast.success("Habit deleted successfully");
    }
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number);
    const newMonth = { year, month: month - 1 };
    setSelectedMonthState(newMonth);
  };

  const handleClearCompletions = () => {
    if (
      confirm("Are you sure you want to clear all completions for this month?")
    ) {
      const newCompletions = {};
      Object.keys(completions).forEach((dateKey) => {
        const [year, month] = dateKey.split("-").map(Number);
        if (year !== selectedMonth.year || month - 1 !== selectedMonth.month) {
          newCompletions[dateKey] = completions[dateKey];
        }
      });
      setCompletionsState(newCompletions);
      toast.success("All completions cleared for this month");
    }
  };

  const daysInMonth = getDaysInMonth(selectedMonth.year, selectedMonth.month);
  let totalGoalCompleted = 0;
  let totalGoalIncomplete = 0;

  habits.forEach((habit) => {
    const rate = calculateCompletionRate(
      habit,
      completions,
      selectedMonth.year,
      selectedMonth.month,
    );
    totalGoalCompleted += rate.completed;
    totalGoalIncomplete += habit.goalDays - rate.completed;
  });

  const weeklyProgress = [];
  for (let week = 1; week <= 5; week++) {
    let weekCompleted = 0;
    let weekTotal = 0;

    habits.forEach((habit) => {
      const startDay = (week - 1) * 7 + 1;
      const endDay = Math.min(week * 7, daysInMonth);

      for (let day = startDay; day <= endDay; day++) {
        const dateKey = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (completions[dateKey]?.includes(habit.id)) {
          weekCompleted++;
        }
        weekTotal++;
      }
    });

    weeklyProgress.push({
      week,
      percentage: weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0,
    });
  }

  const dailyData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    let completed = 0;
    habits.forEach((habit) => {
      const dateKey = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (completions[dateKey]?.includes(habit.id)) {
        completed++;
      }
    });
    dailyData.push({
      name: `Day ${day}`,
      value: habits.length > 0 ? (completed / habits.length) * 100 : 0,
    });
  }

  const weeklyChartData = weeklyProgress.map((wp) => ({
    name: `Week ${wp.week}`,
    value: wp.percentage,
  }));

  const monthlyCompletion =
    totalGoalCompleted > 0
      ? (totalGoalCompleted / (totalGoalCompleted + totalGoalIncomplete)) * 100
      : 0;
  const monthlyChartData = [{ name: "Month", value: monthlyCompletion }];

  const weekColors = ["#fef08a", "#fbcfe8", "#bfdbfe", "#bbf7d0", "#c7d2fe"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                SMART HABIT TRACKER
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
                Transform your daily habits into lasting achievements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <input
                  type="month"
                  value={`${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}`}
                  onChange={handleMonthChange}
                  className="bg-transparent text-slate-900 dark:text-white outline-none cursor-pointer font-medium text-xs"
                />
              </div>
              <button
                onClick={handleClearCompletions}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700 text-xs"
                title="Clear all completions for this month"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-xl font-medium hover:bg-violet-700 transition-all duration-200 shadow-sm text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Habit
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 dark:text-slate-400">
                  Total Goal Completed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalGoalCompleted}
                </p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <TrendingUp
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 dark:text-slate-400">
                  Total Goal Incomplete
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalGoalIncomplete}
                </p>
              </div>
              <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg">
                <TrendingDown
                  className="w-5 h-5 text-rose-600 dark:text-rose-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-4">
          <h2 className="text-sm font-bold text-slate-900 mb-4 dark:text-white">
            Weekly Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {weeklyProgress.map((wp, index) => (
              <div key={wp.week} className="flex flex-col items-center">
                <div
                  style={{ backgroundColor: weekColors[index] }}
                  className="p-2 rounded-lg mb-1.5"
                >
                  <DonutChart
                    percentage={wp.percentage}
                    color="#7c3aed"
                    size={50}
                  />
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Week {wp.week}
                </p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {wp.percentage.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 dark:text-white">
              Habit Completed Per Day %
            </h3>
            <LineChartComponent data={dailyData} color="#7c3aed" height={120} />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 dark:text-white">
              Habit Completed Per Week %
            </h3>
            <LineChartComponent
              data={weeklyChartData}
              color="#059669"
              height={120}
            />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 dark:text-white">
              Habit Completed Per Month %
            </h3>
            <LineChartComponent
              data={monthlyChartData}
              color="#d97706"
              height={120}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Habit Tracking - {getMonthName(selectedMonth.month)}{" "}
              {selectedMonth.year}
            </h2>
          </div>
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-2">
                <Plus
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
                  strokeWidth={2}
                />
              </div>
              <p className="text-xs font-semibold text-slate-600 mb-1 dark:text-slate-400">
                No habits yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Add your first habit to start tracking your progress!
              </p>
            </div>
          ) : (
            <HabitGrid
              habits={habits}
              completions={completions}
              year={selectedMonth.year}
              month={selectedMonth.month}
              onToggleCompletion={handleToggleCompletion}
              onDeleteHabit={handleDeleteHabit}
            />
          )}
        </div>
      </main>

      <HabitModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />
    </div>
  );
}
