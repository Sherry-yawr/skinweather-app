import { Cloud, CloudRain, Sun, Snowflake, Wind, Droplets, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  location: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      case 'snowy':
        return <Snowflake className="w-12 h-12 text-blue-300" />;
      case 'windy':
        return <Wind className="w-12 h-12 text-gray-600" />;
      default:
        return <Sun className="w-12 h-12" />;
    }
  };

  const getUVLevel = () => {
    if (weather.uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
    if (weather.uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (weather.uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
    return { level: 'Very High', color: 'text-red-600' };
  };

  const uvLevel = getUVLevel();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Weather</span>
          {getWeatherIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-5xl mb-2">{weather.temperature}°C</p>
          <p className="text-xl text-gray-600 capitalize">{weather.condition}</p>
          <p className="text-sm text-gray-500 capitalize mt-1">{weather.season} Season</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Thermometer className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-xs text-gray-600">Temperature</p>
            <p className="text-sm">{weather.temperature}°C</p>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-xs text-gray-600">Humidity</p>
            <p className="text-sm">{weather.humidity}%</p>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Sun className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-xs text-gray-600">UV Index</p>
            <p className={`text-sm ${uvLevel.color}`}>{weather.uvIndex} - {uvLevel.level}</p>
          </div>
        </div>

        <div className="text-center mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">{weather.location}</p>
        </div>
      </CardContent>
    </Card>
  );
}
