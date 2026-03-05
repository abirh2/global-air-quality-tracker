'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, AlertCircle, Globe, Sun, Moon, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAirQuality, AQIData } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import AQICard from '@/components/AQICard';
import TrendChart from '@/components/TrendChart';
import MetricCards from '@/components/MetricCards';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center"><Loader2 className="w-10 h-10 text-teal-500 animate-spin" /></div>
});

export default function AirQualityApp() {
  const [location, setLocation] = useState<[number, number]>([37.7749, -122.4194]); // Default SF
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initial theme check
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationChange(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please check your permissions.');
        setIsLocating(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    // Initial geolocation
    handleGetCurrentLocation();
  }, [handleGetCurrentLocation]);

  const handleLocationChange = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    setLocation([lat, lon]);
    try {
      const data = await fetchAirQuality(lat, lon);
      setAqiData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch air quality data');
      setAqiData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 right-0 z-[1001] px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight leading-none ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Global Air</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Quality Explorer</p>
          </div>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-2">
          <SearchBar onCitySelect={(lat, lon) => handleLocationChange(lat, lon)} theme={theme} />
          <button 
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className={`w-12 h-12 rounded-2xl glass-panel flex items-center justify-center transition-all ${isLocating ? 'animate-pulse' : ''} ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            title="Use current location"
          >
            <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:text-teal-600 transition-all ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className={`flex backdrop-blur-md rounded-xl p-1 border ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white/50 border-black/5'}`}>
            <button 
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitSystem === 'imperial' ? (isDark ? 'bg-slate-700 text-teal-400 shadow-sm' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
            >
              Imperial
            </button>
            <button 
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitSystem === 'metric' ? (isDark ? 'bg-slate-700 text-teal-400 shadow-sm' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
            >
              Metric
            </button>
          </div>
          <button className={`px-4 py-2 text-sm font-bold hover:text-teal-600 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Alerts</button>
        </div>
      </header>

      {/* Main Map View */}
      <div className="flex-1 relative">
        <Map center={location} onLocationSelect={handleLocationChange} theme={theme} />
        
        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none z-[1000] flex flex-col md:flex-row p-6 pt-24 gap-6">
          {/* Left Column: AQI Card & Metrics */}
          <div className="flex flex-col gap-6 w-full max-w-sm pointer-events-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                >
                  <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
                  <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fetching Data...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center border-red-100 ${isDark ? 'dark:border-red-900/30' : ''}`}
                >
                  <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                  <p className={`text-sm font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Oops!</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{error}</p>
                  <button 
                    onClick={() => handleLocationChange(location[0], location[1])}
                    className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : aqiData && (
                <div className="flex flex-col gap-6">
                  <AQICard data={aqiData} theme={theme} />
                  <MetricCards weather={aqiData.weather} unitSystem={unitSystem} theme={theme} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column / Bottom: Trend Chart */}
          <div className="flex-1 flex flex-col justify-end items-end pointer-events-none">
            <div className="w-full max-w-lg pointer-events-auto">
              {!isLoading && !error && aqiData && (
                <TrendChart data={aqiData.trend} color={aqiData.color} theme={theme} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] glass-panel px-4 py-2 rounded-full flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Live Data</span>
        </div>
        <div className={`w-px h-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Powered by Open-Meteo & Nominatim</p>
      </footer>
    </div>
  );
}
