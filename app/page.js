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
    if (habits.length > 0) setHabits(habits);
  }, [habits]);

  useEffect(() => {
    setCompletions(completions);
  }, [completions]);

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
    }
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number);
    const newMonth = { year, month: month - 1 };
    setSelectedMonthState(newMonth);
    setSelectedMonth(year, month - 1);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30">
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/20 relative overflow-hidden">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200">
                SMART HABIT TRACKER
              </h1>
              <p className="text-violet-100 mt-1 text-sm">
                Transform your daily habits into lasting achievements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Calendar className="w-4 h-4 text-violet-200" />
                <input
                  type="month"
                  value={`${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}`}
                  onChange={handleMonthChange}
                  className="bg-transparent text-white outline-none cursor-pointer font-semibold text-sm"
                />
              </div>
              <button
                onClick={handleClearCompletions}
                className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 shadow-lg"
                title="Clear all completions for this month"
              >
                <Eraser className="w-4 h-4" />
                Clear
              </button>
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-white text-violet-600 px-4 py-2 rounded-xl font-bold hover:bg-violet-50 transition-all duration-300 shadow-lg shadow-white/20 hover:shadow-white/30 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 p-4 border border-white/50 relative overflow-hidden group hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Total Goal Completed
                </p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {totalGoalCompleted}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl shadow-md">
                <TrendingUp
                  className="w-6 h-6 text-green-600"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-rose-500/10 p-4 border border-white/50 relative overflow-hidden group hover:shadow-xl hover:shadow-rose-500/20 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-rose-400 to-red-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Total Goal Incomplete
                </p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-600">
                  {totalGoalIncomplete}
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-100 to-red-100 p-3 rounded-xl shadow-md">
                <TrendingDown
                  className="w-6 h-6 text-rose-600"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 p-4 mb-6 border border-white/50">
          <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full"></span>
            Weekly Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weeklyProgress.map((wp, index) => (
              <div key={wp.week} className="flex flex-col items-center group">
                <div
                  style={{ backgroundColor: weekColors[index] }}
                  className="p-3 rounded-2xl mb-2 shadow-md group-hover:scale-110 transition-transform duration-300"
                >
                  <DonutChart
                    percentage={wp.percentage}
                    color="#7c3aed"
                    size={60}
                  />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Week {wp.week}
                </p>
                <p className="text-sm font-extrabold text-slate-900">
                  {wp.percentage.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 p-4 border border-white/50 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-violet-600 rounded-full"></span>
              Habit Completed Per Day %
            </h3>
            <LineChartComponent data={dailyData} color="#7c3aed" height={150} />
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-emerald-500/10 p-4 border border-white/50 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
              Habit Completed Per Week %
            </h3>
            <LineChartComponent
              data={weeklyChartData}
              color="#059669"
              height={150}
            />
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-amber-500/10 p-4 border border-white/50 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-600 rounded-full"></span>
              Habit Completed Per Month %
            </h3>
            <LineChartComponent
              data={monthlyChartData}
              color="#d97706"
              height={150}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 p-4 border border-white/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full"></span>
              Habit Tracking - {getMonthName(selectedMonth.month)}{" "}
              {selectedMonth.year}
            </h2>
          </div>
          {habits.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-100 rounded-full mb-3">
                <Plus className="w-7 h-7 text-violet-600" strokeWidth={2.5} />
              </div>
              <p className="text-base font-semibold text-slate-600 mb-1">
                No habits yet
              </p>
              <p className="text-sm text-slate-500">
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
