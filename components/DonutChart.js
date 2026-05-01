'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function DonutChart({ percentage, color, size = 120 }) {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  return (
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
        >
          <Cell fill={color} />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
