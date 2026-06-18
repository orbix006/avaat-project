'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function TrendAreaChart({ data, xKey, yKey, color = "#d4af37", name = "Value" }: any) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
          <XAxis dataKey={xKey} stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f1f1f', borderColor: `${color}33`, fontSize: '12px' }}
            itemStyle={{ color: color }}
          />
          <Area type="monotone" dataKey={yKey} name={name} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${yKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WinLossStackedChart({ data }: any) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="won" name="Won Deals" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={40} />
          <Bar dataKey="lost" name="Lost Deals" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ['#d4af37', '#9ca3af', '#4b5563', '#1f2937', '#e5e7eb', '#3b82f6'];

export function DistributionPieChart({ data }: any) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HorizontalFunnelChart({ data }: any) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} horizontal={false} />
          <XAxis type="number" stroke="#6b7280" fontSize={10} hide />
          <YAxis dataKey="name" type="category" stroke="#d4af37" fontSize={11} tickLine={false} axisLine={false} width={100} />
          <Tooltip 
            cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
            contentStyle={{ backgroundColor: '#1f1f1f', borderColor: 'rgba(212, 175, 55, 0.2)', fontSize: '12px' }}
            itemStyle={{ color: '#d4af37' }}
          />
          <Bar dataKey="value" name="Leads" fill="url(#goldGradientH)" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#9ca3af', fontSize: 11 }} />
          <defs>
            <linearGradient id="goldGradientH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4af37" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#d4af37" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
