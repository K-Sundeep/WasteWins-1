import { useEffect, useMemo, useState } from 'react';

interface WeatherData {
  temperatureC?: number;
  precipitationProb?: number; // next-hour or daily probability
  summary?: string;
}

interface AqiData {
  aqi?: number; // PM2.5 µg/m³ or AQI-like index (OpenAQ returns concentration; we'll map simply)
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

export function useWeatherAqi() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        // silently ignore if blocked
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      if (!coords) return;
      setLoading(true);

      // Open-Meteo: current weather + precipitation probability
      // Docs: https://open-meteo.com/en/docs
      try {
        const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m&hourly=precipitation_probability`;
        const wRes = await fetch(wUrl);
        if (wRes.ok) {
          const w = await wRes.json();
          const temperatureC = w?.current?.temperature_2m;
          const nextHourIndex = 0;
          const precipitationProb = Array.isArray(w?.hourly?.precipitation_probability)
            ? w.hourly.precipitation_probability[nextHourIndex]
            : undefined;
          setWeather({ temperatureC, precipitationProb, summary: undefined });
        }
      } catch {}

      // OpenAQ: nearest PM2.5
      // Docs: https://docs.openaq.org/
      try {
        const aUrl = `https://api.openaq.org/v2/measurements?coordinates=${coords.lat},${coords.lon}&radius=10000&limit=1&parameter=pm25&order_by=datetime&sort=desc`;
        const aRes = await fetch(aUrl);
        if (aRes.ok) {
          const a = await aRes.json();
          const pm25 = a?.results?.[0]?.value as number | undefined;
          setAqi({ aqi: pm25, category: categorizeAQI(pm25) });
        }
      } catch {}

      setLoading(false);
    };

    fetchAll();
  }, [coords]);

  const info = useMemo(() => ({ coords, weather, aqi, loading }), [coords, weather, aqi, loading]);

  return info;
}
