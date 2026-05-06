import { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Sparkles, Navigation, AlertCircle } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SkincareRoutine } from './components/SkincareRoutine';
import { SuggestedProducts } from './components/SuggestedProducts';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { DebugPanel } from './components/DebugPanel';
import { LocationTroubleshoot } from './components/LocationTroubleshoot';
import { getMockWeatherData, getSkincareRecommendations } from './utils/skincareRecommendations';
import { getWeatherByCity, getWeatherByCoordinates } from './utils/weatherAPI';

function App() {
  const [city, setCity] = useState('New York');
  const [inputCity, setInputCity] = useState('New York');
  const initialWeather = getMockWeatherData('New York');
  const [weather, setWeather] = useState(initialWeather);
  const [recommendations, setRecommendations] = useState(getSkincareRecommendations(initialWeather));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealWeather, setUseRealWeather] = useState(false);
  const [locationErrorCode, setLocationErrorCode] = useState<number | undefined>(undefined);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // Fetch real weather on first load using default city
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const newWeather = await getWeatherByCity('New York');
        setWeather(newWeather);
        setRecommendations(getSkincareRecommendations(newWeather));
        setUseRealWeather(true);
      } catch (err) {
        console.warn('Initial weather fetch failed, using demo data:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchInitial();
  }, []);

  // Refresh real weather every 10 minutes
  useEffect(() => {
    if (!useRealWeather) return;
    const interval = setInterval(async () => {
      try {
        const newWeather = await getWeatherByCity(city);
        setWeather(newWeather);
        setRecommendations(getSkincareRecommendations(newWeather));
        setError(null);
      } catch (err) {
        console.error('Failed to update weather:', err);
      }
    }, 600000);
    return () => clearInterval(interval);
  }, [city, useRealWeather]);

  const handleUpdateLocation = async () => {
    if (inputCity.trim()) {
      setIsUpdating(true);
      setError(null);
      setCity(inputCity);
      
      try {
        const newWeather = await getWeatherByCity(inputCity);
        setWeather(newWeather);
        setRecommendations(getSkincareRecommendations(newWeather));
        setUseRealWeather(true);
      } catch (err) {
        setError('Failed to fetch weather data. Using demo data instead.');
        const newWeather = getMockWeatherData(inputCity);
        setWeather(newWeather);
        setRecommendations(getSkincareRecommendations(newWeather));
      }
      
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  const handleRefresh = async () => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const newWeather = await getWeatherByCity(city);
      setWeather(newWeather);
      setRecommendations(getSkincareRecommendations(newWeather));
      setUseRealWeather(true);
    } catch (err) {
      setError('Failed to fetch weather data. Using demo data instead.');
      const newWeather = getMockWeatherData(city);
      setWeather(newWeather);
      setRecommendations(getSkincareRecommendations(newWeather));
    }
    
    setTimeout(() => {
      setIsUpdating(false);
    }, 500);
  };

  const handleGetCurrentLocation = async () => {
    setIsUpdating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsUpdating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('✓ Location obtained:', { latitude, longitude });
          const newWeather = await getWeatherByCoordinates(latitude, longitude);
          console.log('✓ Weather data received:', newWeather);
          setWeather(newWeather);
          setCity(newWeather.location);
          setInputCity(newWeather.location);
          setRecommendations(getSkincareRecommendations(newWeather));
          setUseRealWeather(true);
          setError(null);
          setShowTroubleshoot(false);
          setLocationErrorCode(undefined);
        } catch (err) {
          console.error('✗ Weather API error:', err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(`Failed to fetch weather data: ${errorMessage}`);
          setShowTroubleshoot(false);
        } finally {
          setIsUpdating(false);
        }
      },
      (positionError) => {
        // GeolocationPositionError properties
        const errorCode = positionError?.code;
        const errorMessage = positionError?.message || '';

        // Check if it's a permissions policy error (common in iframes)
        const isPermissionsPolicyError = errorMessage.toLowerCase().includes('permissions policy');

        // Only log errors that aren't permissions policy (which is expected in this environment)
        if (!isPermissionsPolicyError) {
          console.error('✗ Geolocation error:', {
            code: errorCode,
            message: errorMessage,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
          });
        }

        if (isPermissionsPolicyError || errorCode === 1) {
          // For permissions policy errors, show a friendly info message instead of an error
          setError(null);
          setShowTroubleshoot(true);
          setLocationErrorCode(errorCode);
        } else {
          // For other errors, show traditional error handling
          setLocationErrorCode(errorCode);
          setShowTroubleshoot(true);

          let userMessage = 'Unable to retrieve your location. ';

          if (errorCode === 2) {
            userMessage += 'Location information is unavailable.';
          } else if (errorCode === 3) {
            userMessage += 'Location request timed out.';
          } else {
            userMessage += errorMessage || 'An unknown error occurred.';
          }

          setError(userMessage + ' Please use manual search below.');
        }

        setIsUpdating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const popularCities = ['New York', 'Los Angeles', 'Miami', 'Seattle', 'Chicago', 'Denver', 'Phoenix', 'Boston', 'London', 'Tokyo', 'Sydney', 'Dubai'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl">SkinSync</h1>
                <p className="text-sm text-gray-600">
                  Weather-adaptive skincare routines 
                  {useRealWeather && <span className="text-green-600 ml-1">• Live Weather</span>}
                  {!useRealWeather && <span className="text-orange-600 ml-1">• Demo Mode</span>}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                className="gap-2"
                disabled={isUpdating}
              >
                <Navigation className={`w-4 h-4 ${isUpdating ? 'animate-pulse' : ''}`} />
                Use My Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
                disabled={isUpdating}
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Alert for Demo Mode */}
        {!useRealWeather && isInitialLoad && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Fetching live weather data…
            </AlertDescription>
          </Alert>
        )}
        {!useRealWeather && !isInitialLoad && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Showing demo weather data — live weather fetch failed. Enter a city below or click "Use My Location" to try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Location Troubleshoot Guide */}
        {showTroubleshoot && (
          <div className="mb-6">
            <LocationTroubleshoot 
              errorCode={locationErrorCode}
              onClose={() => setShowTroubleshoot(false)}
            />
          </div>
        )}

        {/* Location Search */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <label className="block mb-3">
              <span className="flex items-center gap-2 text-sm mb-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                Enter your location
              </span>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateLocation()}
                  placeholder="Enter city name..."
                  className="flex-1"
                />
                <Button onClick={handleUpdateLocation} disabled={isUpdating}>
                  Update
                </Button>
              </div>
            </label>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Popular locations:</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((cityName) => (
                  <Badge
                    key={cityName}
                    variant={city === cityName ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={async () => {
                      setInputCity(cityName);
                      setCity(cityName);
                      setIsUpdating(true);
                      try {
                        const newWeather = await getWeatherByCity(cityName);
                        setWeather(newWeather);
                        setRecommendations(getSkincareRecommendations(newWeather));
                        setUseRealWeather(true);
                      } catch {
                        const newWeather = getMockWeatherData(cityName);
                        setWeather(newWeather);
                        setRecommendations(getSkincareRecommendations(newWeather));
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    {cityName}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weather Card - Sidebar */}
          <div className="lg:col-span-1">
            <div className={`transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
              <WeatherCard weather={weather} />
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
              <h3 className="mb-4">Skin Condition Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dryness Level</span>
                  <Badge variant={weather.humidity < 40 ? 'destructive' : weather.humidity < 60 ? 'secondary' : 'default'}>
                    {weather.humidity < 40 ? 'High' : weather.humidity < 60 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">UV Protection Needed</span>
                  <Badge variant={weather.uvIndex > 5 ? 'destructive' : weather.uvIndex > 2 ? 'secondary' : 'default'}>
                    {weather.uvIndex > 5 ? 'Essential' : weather.uvIndex > 2 ? 'Important' : 'Standard'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Moisturizer Type</span>
                  <Badge variant="outline">
                    {weather.temperature < 10 || weather.humidity < 40 ? 'Rich Cream' : weather.humidity > 70 ? 'Light Gel' : 'Medium'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Suggested Products */}
            {recommendations.suggestedProducts && recommendations.suggestedProducts.length > 0 && (
              <div className={`transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
                <SuggestedProducts products={recommendations.suggestedProducts} />
              </div>
            )}
          </div>

          {/* Skincare Routines - Main Content */}
          <div className="lg:col-span-2">
            <div className={`transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
              <SkincareRoutine
                morning={recommendations.morning}
                evening={recommendations.evening}
                tips={recommendations.tips}
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="mb-3">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="mb-1">Location-Based</h4>
              <p className="text-sm text-gray-600">
                Get recommendations tailored to your local weather conditions and seasonal patterns.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="mb-1">Real-Time Updates</h4>
              <p className="text-sm text-gray-600">
                Your skincare routine adapts automatically as weather conditions change throughout the day.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <h4 className="mb-1">Personalized Care</h4>
              <p className="text-sm text-gray-600">
                Receive specific product recommendations and tips based on temperature, humidity, and UV levels.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Debug Panel */}
      <DebugPanel 
        apiKey=""
        useRealWeather={useRealWeather}
        weather={weather}
        error={error}
      />
    </div>
  );
}

export default App;
