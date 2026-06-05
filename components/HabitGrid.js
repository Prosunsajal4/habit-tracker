"use client";

import { Check, Square, Trash2 } from "lucide-react";

export default function HabitGrid({
  habits,
  completions,
  year,
  month,
  onToggleCompletion,
  onDeleteHabit,
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];

  // Create weeks array
  let currentWeek = [];
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }

  const weekColors = [
    "bg-yellow-50",
    "bg-pink-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-indigo-50",
  ];

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDay = isCurrentMonth ? today.getDate() : -1;

  const formatDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isCompleted = (habitId, day) => {
    const dateKey = formatDateKey(day);
    return completions[dateKey]?.includes(habitId) || false;
  };

  const getCompletionCount = (habit) => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if (isCompleted(habit.id, day)) count++;
    }
    return count;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm dark:border-slate-700 dark:shadow-slate-900/50 transition-shadow hover:shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800">
            <th className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-700 w-8 text-xs dark:border-slate-600 dark:text-slate-300">
              #
            </th>
            <th className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-700 w-40 text-xs dark:border-slate-600 dark:text-slate-300">
              HABIT NAMES
            </th>
            <th className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 w-12 text-xs dark:border-slate-600 dark:text-slate-300">
              Goal
            </th>
            {weeks.map((week, weekIndex) => (
              <th
                key={weekIndex}
                colSpan={week.length}
                className={`border border-slate-200 px-1 py-2 text-center font-bold text-slate-700 text-xs ${weekColors[weekIndex]} dark:border-slate-600 dark:text-slate-300`}
              >
                WEEK {weekIndex + 1}
              </th>
            ))}
            <th className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 w-16 text-xs dark:border-slate-600 dark:text-slate-300">
              Goal Complete
            </th>
            <th className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 w-16 text-xs dark:border-slate-600 dark:text-slate-300">
              Days Complete
            </th>
            <th className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 w-12 text-xs dark:border-slate-600 dark:text-slate-300">
              Actions
            </th>
          </tr>
          <tr className="bg-slate-50/80 dark:bg-slate-800/80">
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400">
              Days
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const weekIndex = Math.floor(i / 7);
              const isToday = i + 1 === todayDay;
              return (
                <th
                  key={i}
                  className={`border border-slate-200 px-0.5 py-1 text-center font-semibold text-[9px] ${
                    isToday
                      ? "bg-violet-200 text-violet-800 dark:bg-violet-700/60 dark:text-violet-100"
                      : `${weekColors[weekIndex]} text-slate-600 dark:text-slate-400`
                  } dark:border-slate-600`}
                >
                  {i + 1}
                </th>
              );
            })}
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-[10px] dark:border-slate-600 dark:text-slate-400"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, index) => (
            <tr
              key={habit.id}
              className="hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-colors duration-150 group"
            >
              <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-600 font-semibold text-xs dark:border-slate-600 dark:text-slate-400">
                {index + 1}
              </td>
              <td className="border border-slate-200 px-2 py-1.5 text-left text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                <div className="flex flex-col gap-1">
                  <span className="truncate max-w-[10rem]">{habit.name}</span>
                  <div
                    className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                    title={`${getCompletionCount(habit)} / ${habit.goalDays} days`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        getCompletionCount(habit) >= habit.goalDays
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (getCompletionCount(habit) / habit.goalDays) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-700 font-semibold text-xs dark:border-slate-600 dark:text-slate-300">
                {habit.goalDays}
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const weekIndex = Math.floor(i / 7);
                const completed = isCompleted(habit.id, day);
                const isToday = day === todayDay;
                return (
                  <td
                    key={i}
                    className={`border border-slate-200 px-0.5 py-1 text-center ${
                      isToday
                        ? "bg-violet-100 dark:bg-violet-900/30 ring-1 ring-inset ring-violet-300 dark:ring-violet-600/50"
                        : `${weekColors[weekIndex]}`
                    } dark:border-slate-600`}
                  >
                    <button
                      onClick={() => onToggleCompletion(habit.id, day)}
                      aria-pressed={completed}
                      aria-label={`Toggle day ${day} for ${habit.name}`}
                      className={`w-5 h-5 flex items-center justify-center mx-auto rounded-md transition-all duration-200 hover:scale-125 active:scale-95 ${
                        completed
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "hover:bg-slate-200/60 dark:hover:bg-slate-600/40"
                      }`}
                    >
                      {completed ? (
                        <Check
                          className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 transition-transform"
                          strokeWidth={3.5}
                        />
                      ) : (
                        <Square
                          className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </td>
                );
              })}
              <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                {getCompletionCount(habit)}/{habit.goalDays}
              </td>
              <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                {getCompletionCount(habit)}
              </td>
              <td className="border border-slate-200 px-2 py-1.5 text-center dark:border-slate-600">
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 dark:hover:bg-red-900/30 dark:text-red-400 dark:hover:text-red-300 hover:scale-110 active:scale-95"
                  title="Delete habit"
                  aria-label={`Delete habit ${habit.name}`}
                >
                  <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
