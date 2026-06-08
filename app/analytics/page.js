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
import { Target, Flame, Trophy, Calendar } from "lucide-react";
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
  const [habits, setHabits] = useState(() => getHabits() || []);
  const [completions, setCompletions] = useState(() => getCompletions() || {});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const totalCompleted = habitStats.reduce((s, h) => s + h.completed, 0);
  const totalGoal = habitStats.reduce((s, h) => s + (h.goalDays || 0), 0);
  const bestHabit = [...habitStats].sort((a, b) => b.rate - a.rate)[0];
  const activeHabits = habitStats.length;
  const bestMonth = [...monthlyStats].sort((a, b) => b.rate - a.rate)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/30 dark:to-pink-900/30 transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden dark:from-purple-900 dark:via-fuchsia-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 animate-pulse"></div>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>
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
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300 shadow-lg dark:bg-slate-800/15 dark:border-slate-700/20">
              <label className="text-base font-semibold text-purple-100 dark:text-purple-200">
                Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white outline-none cursor-pointer font-semibold text-base dark:text-slate-200 appearance-none pr-1"
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
              <span className="text-white/70 text-xs">▾</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryTile
            icon={Target}
            label="Total Completed"
            value={totalCompleted}
            accent="from-violet-500 to-fuchsia-500"
          />
          <SummaryTile
            icon={Trophy}
            label="Top Habit"
            value={bestHabit ? bestHabit.name : "—"}
            sub={bestHabit ? `${bestHabit.rate.toFixed(1)}%` : ""}
            accent="from-amber-500 to-orange-500"
          />
          <SummaryTile
            icon={Flame}
            label="Active Habits"
            value={activeHabits}
            accent="from-rose-500 to-pink-500"
          />
          <SummaryTile
            icon={Calendar}
            label="Best Month"
            value={bestMonth ? bestMonth.name : "—"}
            sub={bestMonth ? `${bestMonth.rate.toFixed(1)}%` : ""}
            accent="from-emerald-500 to-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-purple-500/25">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
              <span className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
              Habit Details
            </h2>
            {habitStats.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 mb-3 shadow-sm">
                  <Target
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  No data for {selectedYear}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Create habits and start checking them off to see analytics
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {habitStats.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
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
                          {((habit.completed / habit.goalDays) * 100).toFixed(
                            1,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 dark:bg-slate-600/80">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (habit.completed / habit.goalDays) * 100)}%`,
                        }}
                      />
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
                  cy="45%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={85}
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
                    backgroundColor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [`${value} check-ins`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[80px]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-500/15 p-6 border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 dark:shadow-pink-500/25 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 dark:text-slate-100">
            <span className="w-2 h-6 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full" />
            Individual Habit Performance
          </h2>
          {habitStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Performance stats will appear here once you add habits.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {habitStats.map((habit, index) => (
                <div
                  key={habit.id}
                  className="p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-base truncate">
                        {habit.name}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-pink-600 dark:text-pink-400">
                      {((habit.completed / habit.goalDays) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 dark:bg-slate-600 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (habit.completed / habit.goalDays) * 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-3 dark:text-slate-400">
                    {habit.completed} of {habit.goalDays} days completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="container mx-auto px-4 pb-8">
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Analytics for {selectedYear} · Updated in real time
        </p>
      </footer>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 dark:bg-slate-800/90 dark:border-slate-700/60 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg bg-gradient-to-br ${accent} text-white shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
        >
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-white truncate">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-white truncate">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
