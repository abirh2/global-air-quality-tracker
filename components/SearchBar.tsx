'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCity } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  onCitySelect: (lat: number, lon: number, name: string) => void;
  theme: 'light' | 'dark';
}

export default function SearchBar({ onCitySelect, theme }: SearchBarProps) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ lat: number; lon: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const data = await searchCity(query);
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className={`w-full pl-12 pr-4 py-3 backdrop-blur-md border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${isDark ? 'bg-slate-900/80 border-white/10 text-slate-200 placeholder:text-slate-500 focus:bg-slate-900' : 'bg-white/80 border-black/5 text-slate-950 placeholder:text-slate-400 focus:bg-white'}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full left-0 right-0 mt-2 backdrop-blur-xl border rounded-2xl shadow-xl overflow-hidden z-[1000] ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-black/5'}`}
          >
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onCitySelect(result.lat, result.lon, result.name);
                  setQuery('');
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-3 flex items-start gap-3 transition-colors text-left border-b last:border-none ${isDark ? 'hover:bg-slate-800 border-slate-800' : 'hover:bg-teal-50 border-slate-100'}`}
              >
                <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <span className={`text-sm line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
