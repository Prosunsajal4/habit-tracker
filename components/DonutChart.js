"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function DonutChart({ percentage, color, size = 120 }) {
  const safePercentage = Math.max(0, Math.min(100, percentage || 0));
  const data = [
    { name: "Completed", value: safePercentage },
    { name: "Remaining", value: 100 - safePercentage },
  ];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(safePercentage)} percent complete`}
    >
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          >
            <Cell fill={color} className="transition-all duration-300" />
            <Cell
              fill="#e5e7eb"
              className="dark:fill-slate-700 transition-all duration-300"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <span
        className="absolute font-extrabold text-slate-700 dark:text-slate-100 pointer-events-none tracking-tight"
        style={{ fontSize: size * 0.2, textShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
      >
        {Math.round(safePercentage)}%
      </span>
    </div>
  );
}
