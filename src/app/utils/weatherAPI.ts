// ============================================================
// weatherAPI.ts  –  Tomorrow.io (primary) + Open-Meteo (fallback)
// ============================================================
// HOW TO GET A TOMORROW.IO KEY (free, 500 calls/day):
//   1. Go to https://app.tomorrow.io/signup
//   2. Create a free account
//   3. Copy your API key from the dashboard
//   4. Paste it below
// ============================================================

const TOMORROW_API_KEY = 'YOUR_TOMORROW_IO_KEY_HERE';

export interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  location: string;
  // Extended fields from Tomorrow.io
  feelsLike?: number;
  dewPoint?: number;
  windSpeed?: number;
  precipitationProbability?: number;
  cloudCover?: number;
  visibility?: number;
}

// ── Helpers ──────────────────────────────────────────────────

function getSeason(lat: number): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth(); // 0-11
  const isSouthern = lat < 0;
  const northern: Record<number, 'spring' | 'summer' | 'fall' | 'winter'> = {
    0: 'winter', 1: 'winter', 2: 'spring', 3: 'spring', 4: 'spring',
    5: 'summer', 6: 'summer', 7: 'summer', 8: 'fall', 9: 'fall',
    10: 'fall', 11: 'winter',
  };
  const season = northern[month];
  if (!isSouthern) return season;
  const flip: Record<string, 'spring' | 'summer' | 'fall' | 'winter'> = {
    winter: 'summer', summer: 'winter', spring: 'fall', fall: 'spring',
  };
  return flip[season];
}

// Tomorrow.io weather codes → our condition
function tomorrowCodeToCondition(
  code: number
): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' {
  if ([1000, 1100].includes(code)) return 'sunny';
  if ([1101, 1102, 1001, 2000, 2100].includes(code)) return 'cloudy';
  if (code >= 4000 && code <= 4201) return 'rainy';
  if (code >= 5000 && code <= 5101) return 'snowy';
  if ([3000, 3001, 3002].includes(code)) return 'windy';
  return 'cloudy';
}

// Open-Meteo weather codes → our condition (fallback)
function openMeteoCodeToCondition(
  code: number
): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3 || code === 45 || code === 48) return 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snowy';
  if (code >= 95) return 'rainy';
  return 'cloudy';
}

// ── Tomorrow.io API ───────────────────────────────────────────

async function fetchTomorrowIO(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const fields = [
    'temperature',
    'temperatureApparent',
    'humidity',
    'dewPoint',
    'uvIndex',
    'windSpeed',
    'precipitationProbability',
    'cloudCover',
    'visibility',
    'weatherCode',
  ].join(',');

  const url =
    `https://api.tomorrow.io/v4/weather/realtime` +
    `?location=${lat},${lng}&fields=${fields}&units=metric&apikey=${TOMORROW_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tomorrow.io ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const v = json.data.values;

  // Reverse-geocode location name using Open-Meteo geocoding (free, no key)
  const geoRes = await Promise.race([
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
  ]).catch(() => null);
  const geo = geoRes && (geoRes as Response).ok ? await (geoRes as Response).json() : null;
  const location =
    geo?.address?.city ||
    geo?.address?.town ||
    geo?.address?.village ||
    geo?.address?.county ||
    `${lat.toFixed(2)}, ${lng.toFixed(2)}`;

  return {
    temperature: Math.round(v.temperature),
    feelsLike: Math.round(v.temperatureApparent),
    humidity: Math.round(v.humidity),
    dewPoint: Math.round(v.dewPoint),
    uvIndex: Math.round(v.uvIndex),
    windSpeed: Math.round(v.windSpeed),
    precipitationProbability: Math.round(v.precipitationProbability),
    cloudCover: Math.round(v.cloudCover),
    visibility: Math.round(v.visibility),
    condition: tomorrowCodeToCondition(v.weatherCode),
    season: getSeason(lat),
    location,
  };
}

// ── Open-Meteo fallback ───────────────────────────────────────

async function fetchOpenMeteo(lat: number, lng: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
    `dew_point_2m,uv_index,wind_speed_10m,precipitation_probability,` +
    `cloud_cover,visibility,weather_code` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = await res.json();
  const c = json.current;

  const geoRes = await Promise.race([
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
  ]).catch(() => null);
  const geo = geoRes && (geoRes as Response).ok ? await (geoRes as Response).json() : null;
  const location =
    geo?.address?.city ||
    geo?.address?.town ||
    geo?.address?.village ||
    `${lat.toFixed(2)}, ${lng.toFixed(2)}`;

  return {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: Math.round(c.relative_humidity_2m),
    dewPoint: Math.round(c.dew_point_2m),
    uvIndex: Math.round(c.uv_index),
    windSpeed: Math.round(c.wind_speed_10m),
    precipitationProbability: Math.round(c.precipitation_probability ?? 0),
    cloudCover: Math.round(c.cloud_cover),
    visibility: Math.round(c.visibility / 1000), // m → km
    condition: openMeteoCodeToCondition(c.weather_code),
    season: getSeason(lat),
    location,
  };
}

// ── City geocoding ────────────────────────────────────────────

async function geocodeCity(city: string): Promise<{ lat: number; lng: number }> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
  );
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data.length) throw new Error(`City not found: ${city}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

// ── Public API ────────────────────────────────────────────────

export async function getWeatherByCoordinates(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const hasTomorrowKey =
    TOMORROW_API_KEY && TOMORROW_API_KEY !== 'YOUR_TOMORROW_IO_KEY_HERE';

  if (hasTomorrowKey) {
    try {
      console.log('🌤  Using Tomorrow.io (accurate)');
      return await fetchTomorrowIO(lat, lng);
    } catch (err) {
      console.warn('Tomorrow.io failed, falling back to Open-Meteo:', err);
    }
  } else {
    console.log('ℹ️  No Tomorrow.io key — using Open-Meteo (free fallback)');
  }

  return fetchOpenMeteo(lat, lng);
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const { lat, lng } = await geocodeCity(city);
  return getWeatherByCoordinates(lat, lng);
}
