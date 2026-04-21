interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  location: string;
}

// No API key required — uses Open-Meteo (https://open-meteo.com), a free & open weather API

// Determine season based on month and hemisphere
function getSeason(month: number, latitude: number): 'spring' | 'summer' | 'fall' | 'winter' {
  const isNorthern = latitude >= 0;
  if (month >= 2 && month <= 4) return isNorthern ? 'spring' : 'fall';
  if (month >= 5 && month <= 7) return isNorthern ? 'summer' : 'winter';
  if (month >= 8 && month <= 10) return isNorthern ? 'fall' : 'spring';
  return isNorthern ? 'winter' : 'summer';
}

// Map WMO weather interpretation codes to simplified conditions
// https://open-meteo.com/en/docs#weathervariables
function mapWMOCode(code: number): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' {
  if (code === 0 || code === 1) return 'sunny';           // Clear / mainly clear
  if (code === 2 || code === 3) return 'cloudy';          // Partly / overcast
  if (code >= 51 && code <= 67) return 'rainy';           // Drizzle / rain
  if (code >= 71 && code <= 77) return 'snowy';           // Snow
  if (code >= 80 && code <= 82) return 'rainy';           // Rain showers
  if (code >= 85 && code <= 86) return 'snowy';           // Snow showers
  if (code >= 95 && code <= 99) return 'rainy';           // Thunderstorm
  if (code >= 45 && code <= 48) return 'cloudy';          // Fog
  return 'cloudy';
}

// Reverse geocode lat/lon → city name using Open-Meteo's geocoding partner (nominatim)
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      data.address?.state ||
      '';
    const country = data.address?.country_code?.toUpperCase() || '';
    return city ? `${city}, ${country}` : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  } catch {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}

// Fetch real weather by coordinates using Open-Meteo (no API key needed)
export async function getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m` +
    `&daily=uv_index_max` +
    `&timezone=auto` +
    `&forecast_days=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();

  const current = data.current;
  const temperature = Math.round(current.temperature_2m);
  const humidity = Math.round(current.relative_humidity_2m);
  const windspeed = current.windspeed_10m ?? 0;
  const wmoCode = current.weathercode ?? 0;

  // UV index: today's max from daily (first element)
  const uvIndex = Math.round(data.daily?.uv_index_max?.[0] ?? 0);

  // Determine condition — treat high wind as 'windy' regardless of WMO code
  let condition: WeatherData['condition'] = mapWMOCode(wmoCode);
  if (windspeed > 40) condition = 'windy';

  const month = new Date().getMonth();
  const season = getSeason(month, latitude);
  const location = await reverseGeocode(latitude, longitude);

  return { temperature, humidity, uvIndex, condition, season, location };
}

// Geocode a city name → coordinates, then fetch weather
export async function getWeatherByCity(cityName: string): Promise<WeatherData> {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  if (!geoRes.ok) throw new Error('Geocoding request failed');
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City not found: ${cityName}`);
  }

  const { latitude, longitude, name, country_code } = geoData.results[0];
  const weather = await getWeatherByCoordinates(latitude, longitude);

  // Override location with the canonical city name from geocoding
  const countryUpper = (country_code ?? '').toUpperCase();
  return { ...weather, location: countryUpper ? `${name}, ${countryUpper}` : name };
}
