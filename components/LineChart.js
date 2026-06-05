"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

export default function LineChartComponent({
  data,
  color = "#8884d8",
  height = 200,
}) {
  const gradientId = `lineGradient-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          className="dark:opacity-20"
        />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={16}
          className="dark:[&_text]:fill-slate-400"
        />
        <YAxis
          stroke="#6b7280"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(v) => `${v}%`}
          width={42}
          className="dark:[&_text]:fill-slate-400"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          labelStyle={{ color: "#475569", fontWeight: 600 }}
          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Completion"]}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="none"
          fill={`url(#${gradientId})`}
          animationDuration={600}
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 3.5, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
          animationDuration={600}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
