import { useEffect, useMemo, useState, useCallback } from 'react';
import { EXTERNAL_APIS, CACHE_SETTINGS } from '../constants';

interface WeatherData {
  temperatureC?: number;
  precipitationProb?: number;
  summary?: string;
}

interface AqiData {
  aqi?: number;
  category?: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous' | 'Unknown';
}

function categorizeAQI(pm25?: number): AqiData['category'] {
  if (pm25 == null) return 'Unknown';
  if (pm25 <= 12) return 'Good';
  if (pm25 <= 35.4) return 'Moderate';
  if (pm25 <= 55.4) return 'Unhealthy';
  if (pm25 <= 150.4) return 'Very Unhealthy';
  return 'Hazardous';
}

// Simple cache for weather data
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const aqiCache = new Map<string, { data: AqiData; timestamp: number }>();

export function useWeatherAqi() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const geoOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000, // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        // Silently ignore - weather/AQI is optional
      },
      geoOptions
    );
  }, []);

  // Fetch weather and AQI data
  const fetchAll = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    const cacheKey = `${Math.round(coords.lat * 100)},${Math.round(coords.lon * 100)}`;
    const now = Date.now();

    try {
      // Check weather cache
      const cachedWeather = weatherCache.get(cacheKey);
      if (cachedWeather && now - cachedWeather.timestamp < CACHE_SETTINGS.WEATHER_CACHE_TTL_MS) {
        setWeather(cachedWeather.data);
      } else {
        // Fetch from Open-Meteo
        const wUrl = `${EXTERNAL_APIS.OPEN_METEO}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m&hourly=precipitation_probability`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const wRes = await fetch(wUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (wRes.ok) {
          const w = await wRes.json();
          const weatherData: WeatherData = {
            temperatureC: w?.current?.temperature_2m,
            precipitationProb: Array.isArray(w?.hourly?.precipitation_probability)
              ? w.hourly.precipitation_probability[0]
              : undefined,
            summary: undefined,
          };
          setWeather(weatherData);
          weatherCache.set(cacheKey, { data: weatherData, timestamp: now });
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('Weather fetch failed:', e.message);
      }
    }

    try {
      // Check AQI cache
      const cachedAqi = aqiCache.get(cacheKey);
      if (cachedAqi && now - cachedAqi.timestamp < CACHE_SETTINGS.WEATHER_CACHE_TTL_MS) {
        setAqi(cachedAqi.data);
      } else {
        // Fetch from OpenAQ
        const aUrl = `${EXTERNAL_APIS.OPEN_AQ}?coordinates=${coords.lat},${coords.lon}&radius=10000&limit=1&parameter=pm25&order_by=datetime&sort=desc`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const aRes = await fetch(aUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (aRes.ok) {
          const a = await aRes.json();
          const pm25 = a?.results?.[0]?.value as number | undefined;
          const aqiData: AqiData = {
            aqi: pm25,
            category: categorizeAQI(pm25),
          };
          setAqi(aqiData);
          aqiCache.set(cacheKey, { data: aqiData, timestamp: now });
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('AQI fetch failed:', e.message);
      }
    }

    setLoading(false);
  }, [coords]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return useMemo(
    () => ({ coords, weather, aqi, loading, error, refetch: fetchAll }),
    [coords, weather, aqi, loading, error, fetchAll]
  );
}
