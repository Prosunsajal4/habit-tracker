'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ data, color = '#8884d8', height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
