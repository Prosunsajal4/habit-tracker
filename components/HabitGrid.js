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
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-md dark:border-slate-700 dark:shadow-slate-900/50">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700">
            <th className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-700 w-8 text-xs dark:border-slate-600 dark:text-slate-300">
              #
            </th>
            <th className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-700 w-48 text-xs dark:border-slate-600 dark:text-slate-300">
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
            <th className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 w-10 text-xs dark:border-slate-600 dark:text-slate-300">
              Actions
            </th>
          </tr>
          <tr className="bg-slate-50/80 dark:bg-slate-800/80">
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400">
              Days
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const weekIndex = Math.floor(i / 7);
              return (
                <th
                  key={i}
                  className={`border border-slate-200 px-0.5 py-1 text-center font-semibold text-slate-600 text-[10px] ${weekColors[weekIndex]} dark:border-slate-600 dark:text-slate-400`}
                >
                  {i + 1}
                </th>
              );
            })}
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400"></th>
            <th className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-500 text-xs dark:border-slate-600 dark:text-slate-400"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, index) => (
            <tr
              key={habit.id}
              className="hover:bg-violet-50/50 dark:hover:bg-violet-900/30 transition-colors"
            >
              <td className="border border-slate-200 px-2 py-2 text-center text-slate-600 font-semibold text-xs dark:border-slate-600 dark:text-slate-400">
                {index + 1}
              </td>
              <td className="border border-slate-200 px-2 py-2 text-left text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                {habit.name}
              </td>
              <td className="border border-slate-200 px-2 py-2 text-center text-slate-700 font-semibold text-xs dark:border-slate-600 dark:text-slate-300">
                {habit.goalDays}
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const weekIndex = Math.floor(i / 7);
                const completed = isCompleted(habit.id, day);
                return (
                  <td
                    key={i}
                    className={`border border-slate-200 px-0.5 py-1 text-center ${weekColors[weekIndex]} dark:border-slate-600`}
                  >
                    <button
                      onClick={() => onToggleCompletion(habit.id, day)}
                      className="w-5 h-5 flex items-center justify-center mx-auto hover:scale-125 transition-transform duration-200"
                    >
                      {completed ? (
                        <Check
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          strokeWidth={3}
                        />
                      ) : (
                        <Square
                          className="w-4 h-4 text-slate-300 dark:text-slate-600"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </td>
                );
              })}
              <td className="border border-slate-200 px-2 py-2 text-center text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                {getCompletionCount(habit)}/{habit.goalDays}
              </td>
              <td className="border border-slate-200 px-2 py-2 text-center text-slate-800 font-bold text-xs dark:border-slate-600 dark:text-slate-200">
                {getCompletionCount(habit)}
              </td>
              <td className="border border-slate-200 px-2 py-2 text-center dark:border-slate-600">
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete habit"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
