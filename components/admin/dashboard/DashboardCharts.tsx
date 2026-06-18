'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DashboardChartsProps {
  monthlyVisitors: any[];
  leadsThisMonth: any[];
  newUsersThisMonth: any[];
}

export function DashboardCharts({ monthlyVisitors, leadsThisMonth, newUsersThisMonth }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      {/* Monthly Visitors - Area Chart */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-6 shadow-sm lg:col-span-2">
        <div className="mb-6">
          <h3 className="font-cormorant text-xl font-bold text-ivory">Monthly Visitors (Last 6 Months)</h3>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-1">Traffic and unique visits summary</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyVisitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" opacity={0.08} vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', borderColor: 'rgba(212, 175, 55, 0.2)', fontSize: '12px' }}
                itemStyle={{ color: '#d4af37' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads This Month - Line Chart */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-cormorant text-xl font-bold text-ivory">Leads This Month</h3>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-1">Inbound consultations daily progression</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsThisMonth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" opacity={0.08} vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', borderColor: 'rgba(212, 175, 55, 0.2)', fontSize: '12px' }}
                itemStyle={{ color: '#d4af37' }}
              />
              <Line type="monotone" dataKey="leads" stroke="#d4af37" strokeWidth={2.5} dot={{ r: 3, fill: '#1a1a1a', stroke: '#d4af37', strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Users This Month - Bar Chart */}
      <div className="bg-warm-black border border-gold/10 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-cormorant text-xl font-bold text-ivory">New Users This Month</h3>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-1">Registered profile acquisitions daily progression</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newUsersThisMonth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.08} vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', borderColor: 'rgba(59, 130, 246, 0.2)', fontSize: '12px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="users" fill="url(#blueGradient)" radius={[3, 3, 0, 0]} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
