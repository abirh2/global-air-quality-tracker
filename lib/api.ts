export interface AQIData {
  city: string;
  country: string;
  aqi: number;
  category: string;
  color: string;
  pollutants: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
  };
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
  };
  trend: { time: string; aqi: number }[];
  coordinates: [number, number];
}

export const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: '#10b981' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6' };
  return { label: 'Hazardous', color: '#7f1d1d' };
};

// Open-Meteo Air Quality API wrapper
export async function fetchAirQuality(lat: number, lon: number): Promise<AQIData> {
  try {
    // 1. Fetch City Name via Reverse Geocoding
    let cityName = 'Selected Location';
    let countryName = '';
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      const geoData = await geoRes.json();
      cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.suburb || geoData.display_name.split(',')[0];
      countryName = geoData.address?.country || '';
    } catch (e) {
      console.warn('Reverse geocoding failed', e);
    }

    // 2. Fetch Air Quality Data (including past 24 hours for trend)
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide&hourly=pm2_5,pm10,ozone,nitrogen_dioxide&past_days=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`AQ API error: ${response.status}`);
    const data = await response.json();

    if (!data.current) throw new Error('No current air quality data found');
    const current = data.current;
    
    // AQI Calculation (Simplified US EPA)
    const pm25 = current.pm2_5 || 0;
    let aqi = 0;
    if (pm25 <= 12) aqi = (pm25 / 12) * 50;
    else if (pm25 <= 35.4) aqi = 50 + ((pm25 - 12) / (35.4 - 12)) * 50;
    else if (pm25 <= 55.4) aqi = 100 + ((pm25 - 35.4) / (55.4 - 35.4)) * 50;
    else if (pm25 <= 150.4) aqi = 150 + ((pm25 - 55.4) / (150.4 - 55.4)) * 50;
    else aqi = 200 + ((pm25 - 150.4) / 100) * 100;

    const roundedAqi = Math.round(aqi);
    const { label, color } = getAQICategory(roundedAqi);

    // Trend Data: Find current hour and take previous 24 hours
    const now = new Date();
    const currentHourISO = new Date(now.setMinutes(0, 0, 0)).toISOString().slice(0, 16);
    
    // Find index of current hour in hourly data
    const currentIndex = data.hourly.time.findIndex((t: string) => t.startsWith(currentHourISO));
    const startIndex = currentIndex >= 23 ? currentIndex - 23 : 0;
    const endIndex = currentIndex + 1;

    const trend = data.hourly.time.slice(startIndex, endIndex).map((time: string, index: number) => {
      const actualIndex = startIndex + index;
      const hPm25 = data.hourly.pm2_5[actualIndex];
      let hAqi = 0;
      if (hPm25 <= 12) hAqi = (hPm25 / 12) * 50;
      else if (hPm25 <= 35.4) hAqi = 50 + ((hPm25 - 12) / (35.4 - 12)) * 50;
      else if (hPm25 <= 55.4) hAqi = 100 + ((hPm25 - 35.4) / (55.4 - 35.4)) * 50;
      else hAqi = 150;
      return {
        time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: Math.round(hAqi),
      };
    });

    // 3. Fetch Weather Data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    return {
      city: cityName,
      country: countryName,
      aqi: roundedAqi,
      category: label,
      color,
      pollutants: {
        pm25: current.pm2_5,
        pm10: current.pm10,
        o3: current.ozone,
        no2: current.nitrogen_dioxide,
      },
      weather: {
        temp: weatherData.current?.temperature_2m || 0,
        humidity: weatherData.current?.relative_humidity_2m || 0,
        windSpeed: weatherData.current?.wind_speed_10m || 0,
      },
      trend,
      coordinates: [lat, lon],
    };
  } catch (error) {
    console.error('Error fetching air quality:', error);
    throw error;
  }
}

export async function searchCity(query: string): Promise<{ lat: number; lon: number; name: string }[]> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
  );
  const data = await response.json();
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.display_name,
  }));
}
