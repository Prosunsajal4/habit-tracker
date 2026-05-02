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
        id: habit.id,
        name: habit.name,
        goalDays: habit.goalDays,
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
      <header className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden dark:from-purple-900 dark:via-fuchsia-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 dark:bg-gradient-to-r dark:from-slate-200 dark:to-pink-200">
                ANALYTICS
              </h1>
              <p className="text-pink-100 mt-1 text-base dark:text-pink-200">
                Track your habit performance and insights
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg dark:bg-slate-800/15 dark:border-slate-700/20">
              <label className="text-base font-semibold text-purple-100 dark:text-purple-200">
                Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white outline-none cursor-pointer font-semibold text-base dark:text-slate-200"
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-purple-500/25">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
              Habit Details
            </h2>
            {habitStats.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-base text-slate-500 dark:text-slate-400">
                  No habit data available for {selectedYear}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {habitStats.map((habit) => (
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
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                        {habit.completed}/{habit.goalDays}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {((habit.completed / habit.goalDays) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-fuchsia-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-fuchsia-500/25 hover:shadow-2xl hover:shadow-fuchsia-500/25 transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-fuchsia-600 to-pink-600 rounded-full"></span>
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

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-pink-500/25">
          <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
            <span className="w-2 h-6 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full"></span>
            Individual Habit Performance
          </h2>
          <div className="space-y-4">
            {habitStats.map((habit, index) => (
              <div
                key={habit.id}
                className="p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    {habit.name}
                  </p>
                  <p className="text-base font-semibold text-pink-600 dark:text-pink-400">
                    {((habit.completed / habit.goalDays) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 dark:bg-slate-600">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(habit.completed / habit.goalDays) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-slate-500 mt-3 dark:text-slate-400">
                  {habit.completed} of {habit.goalDays} days completed
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
