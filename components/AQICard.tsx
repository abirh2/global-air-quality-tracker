'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Wind, Droplets, Thermometer, Info } from 'lucide-react';
import { AQIData } from '@/lib/api';

interface AQICardProps {
  data: AQIData;
  theme: 'light' | 'dark';
}

export default function AQICard({ data, theme }: AQICardProps) {
  const isDark = theme === 'dark';
  const pollutants = [
    { label: 'PM2.5', value: data.pollutants.pm25, unit: 'µg/m³' },
    { label: 'PM10', value: data.pollutants.pm10, unit: 'µg/m³' },
    { label: 'Ozone', value: data.pollutants.o3, unit: 'ppb' },
    { label: 'NO2', value: data.pollutants.no2, unit: 'ppb' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel rounded-3xl p-6 w-full max-w-sm"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{data.city}</h2>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{data.country}</p>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: data.color }}
        >
          {data.category}
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={isDark ? 'text-slate-800' : 'text-slate-100'}
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={data.color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * Math.min(data.aqi, 300)) / 300}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black leading-none ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{data.aqi}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AQI</span>
          </div>
        </div>
        <div className="flex-1">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-800'}`}>
            Air quality is <span className="font-bold" style={{ color: data.color }}>{data.category.toLowerCase()}</span>. 
            {data.aqi > 100 ? ' Consider limiting outdoor activities.' : ' Enjoy your day outdoors!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pollutants.map((p, i) => (
          <div key={i} className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.label}</p>
            <p className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {p.value?.toFixed(1) || '--'} 
              <span className={`text-[10px] font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
