"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getHabits, getCompletions } from "@/lib/storage";
import { getMonthName } from "@/lib/utils";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function Analytics() {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setHabits(getHabits() || []);
    setCompletions(getCompletions() || {});
  }, []);

  const calculateHabitStats = () => {
    return habits.map((habit) => {
      let totalCompleted = 0;
      let totalPossible = 0;

      Object.keys(completions).forEach((dateKey) => {
        const [year, month, day] = dateKey.split("-").map(Number);
        if (year === selectedYear) {
          if (completions[dateKey]?.includes(habit.id)) {
            totalCompleted++;
          }
          totalPossible++;
        }
      });

      const completionRate =
        totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

      return {
        name: habit.name,
        completed: totalCompleted,
        total: totalPossible,
        rate: completionRate,
      };
    });
  };

  const calculateMonthlyStats = () => {
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      let monthCompleted = 0;
      let monthTotal = 0;

      habits.forEach((habit) => {
        const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = `${selectedYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          if (completions[dateKey]?.includes(habit.id)) {
            monthCompleted++;
          }
          monthTotal++;
        }
      });

      monthlyData.push({
        name: getMonthName(month).substring(0, 3),
        completed: monthCompleted,
        total: monthTotal,
        rate: monthTotal > 0 ? (monthCompleted / monthTotal) * 100 : 0,
      });
    }

    return monthlyData;
  };

  const habitStats = calculateHabitStats();
  const monthlyStats = calculateMonthlyStats();

  const pieData = habitStats.map((h) => ({
    name: h.name,
    value: h.completed,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/30 dark:to-pink-900/30 transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden dark:bg-gradient-to-r dark:from-purple-900 dark:via-fuchsia-900 dark:to-pink-900">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 dark:bg-gradient-to-r dark:from-slate-200 dark:to-pink-200">
                ANALYTICS
              </h1>
              <p className="text-pink-100 mt-1 text-sm dark:text-pink-200">
                Track your habit performance and insights
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 dark:bg-slate-800/15 dark:border-slate-700/20">
              <label className="text-sm font-semibold text-purple-100 dark:text-purple-200">
                Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white outline-none cursor-pointer font-semibold text-sm dark:text-slate-200"
              >
                {[2024, 2025, 2026, 2027, 2028].map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="text-slate-800 dark:text-slate-200"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-500/10 p-4 border border-white/50 dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-purple-500/20">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2 dark:text-slate-100">
              <span className="w-1.5 h-5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
              Habit Details
            </h2>
            {habitStats.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No habit data available for {selectedYear}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {habitStats.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {habit.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Goal: {habit.goalDays} days/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
                        {habit.completed}/{habit.goalDays}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {((habit.completed / habit.goalDays) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-fuchsia-500/10 p-4 border border-white/50 dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-fuchsia-500/20 hover:shadow-xl hover:shadow-fuchsia-500/20 transition-all duration-300">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2 dark:text-slate-100">
              <span className="w-1.5 h-5 bg-gradient-to-b from-fuchsia-600 to-pink-600 rounded-full"></span>
              Habit Distribution
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-500/10 p-8 border border-white/50">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full"></span>
            Individual Habit Performance
          </h2>
          <div className="space-y-5">
            {habitStats.map((habit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-800">
                      {habit.name}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      {habit.completed} / {habit.total} days
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${habit.rate}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Completion Rate
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {habit.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {habitStats.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-xl font-semibold text-slate-600 mb-2">
                No habits to analyze
              </p>
              <p className="text-slate-500">
                Add habits to see your analytics!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
