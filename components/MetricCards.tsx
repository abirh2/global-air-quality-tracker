'use client';

import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardsProps {
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
  };
  unitSystem: 'imperial' | 'metric';
  theme: 'light' | 'dark';
}

export default function MetricCards({ weather, unitSystem, theme }: MetricCardsProps) {
  const isDark = theme === 'dark';
  const convertTemp = (c: number) => {
    if (unitSystem === 'metric') return `${Math.round(c)}°C`;
    return `${Math.round((c * 9) / 5 + 32)}°F`;
  };

  const convertWind = (kmh: number) => {
    if (unitSystem === 'metric') return `${Math.round(kmh)} km/h`;
    return `${Math.round(kmh / 1.609)} mph`;
  };

  const metrics = [
    { 
      label: 'Temperature', 
      value: convertTemp(weather.temp), 
      icon: Thermometer, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      description: 'The current outdoor air temperature in your selected unit.'
    },
    { 
      label: 'Humidity', 
      value: `${Math.round(weather.humidity)}%`, 
      icon: Droplets, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      description: 'The amount of water vapor in the air relative to the maximum amount.'
    },
    { 
      label: 'Wind Speed', 
      value: convertWind(weather.windSpeed), 
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-50',
      description: 'The rate at which air is moving horizontally past a given point.'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center text-center group relative cursor-help transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl"
        >
          <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-slate-800' : m.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <m.icon className={`w-5 h-5 ${m.color}`} />
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{m.label}</p>
          <p className={`text-lg font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{m.value}</p>

          {/* Tooltip Description */}
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border border-white/10 ${isDark ? 'bg-slate-800' : 'bg-slate-900'}`}>
            <p className="font-medium leading-relaxed">{m.description}</p>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${isDark ? 'border-t-slate-800' : 'border-t-slate-900'}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
