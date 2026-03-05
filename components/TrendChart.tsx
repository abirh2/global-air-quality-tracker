'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface TrendChartProps {
  data: { time: string; aqi: number }[];
  color: string;
  theme: 'light' | 'dark';
}

export default function TrendChart({ data, color, theme }: TrendChartProps) {
  const isDark = theme === 'dark';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 h-64"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          24h AQI Trend
        </h3>
      </div>
      
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className={isDark ? 'text-slate-800' : 'text-slate-200'} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className={isDark ? 'text-slate-500' : 'text-slate-600'}
              interval={4}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className={isDark ? 'text-slate-500' : 'text-slate-600'}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--glass-bg)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '12px', 
                border: '1px solid var(--glass-border)', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'var(--text-app)'
              }}
              itemStyle={{ color: color }}
            />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAqi)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
