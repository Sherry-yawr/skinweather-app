import { useState } from 'react';
import { Bug, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { testOpenWeatherAPI, testGeolocation } from '../utils/testWeatherAPI';

interface DebugPanelProps {
  apiKey?: string;
  useRealWeather: boolean;
  weather: any;
  error: string | null;
}

export function DebugPanel({ useRealWeather, weather, error }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<{ api?: any; location?: any }>({});

  const handleTestAPI = async () => {
    const result = await testOpenWeatherAPI('');
    setTestResults(prev => ({ ...prev, api: result }));
  };

  const handleTestLocation = async () => {
    const result = await testGeolocation();
    setTestResults(prev => ({ ...prev, location: result }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="shadow-lg gap-2"
        >
          <Bug className="w-4 h-4" />
          Debug
        </Button>
      ) : (
        <Card className="w-80 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Debug Panel
              </CardTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            <div>
              <div className="font-medium text-gray-700 mb-1">API Status</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className={useRealWeather ? 'text-green-600' : 'text-orange-600'}>
                    {useRealWeather ? '🟢 Live Weather' : '🟡 Demo Mode'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weather Source:</span>
                  <span className="text-blue-600">Open-Meteo (free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Browser Location:</span>
                  <span>
                    {navigator.geolocation ? '✓ Supported' : '✗ Not Supported'}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div>
                <div className="font-medium text-red-600 mb-1">Current Error</div>
                <div className="bg-red-50 p-2 rounded text-red-800 break-words">
                  {error}
                </div>
              </div>
            )}

            <div>
              <div className="font-medium text-gray-700 mb-1">Weather Data</div>
              <div className="bg-gray-50 p-2 rounded space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span>{weather.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temp:</span>
                  <span>{weather.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UV Index:</span>
                  <span>{weather.uvIndex}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">Tests</div>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs gap-2"
                  onClick={handleTestAPI}
                >
                  <Play className="w-3 h-3" />
                  Test API Connection
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs gap-2"
                  onClick={handleTestLocation}
                >
                  <Play className="w-3 h-3" />
                  Test Location Access
                </Button>
              </div>

              {testResults.api && (
                <div className={`mt-2 p-2 rounded text-xs ${testResults.api.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div className="font-medium mb-1">API Test:</div>
                  <div>{testResults.api.message}</div>
                  {testResults.api.data && (
                    <pre className="mt-1 text-xs overflow-auto">
                      {JSON.stringify(testResults.api.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              {testResults.location && (
                <div className={`mt-2 p-2 rounded text-xs ${testResults.location.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div className="font-medium mb-1">Location Test:</div>
                  <div>{testResults.location.message}</div>
                  {testResults.location.coords && (
                    <div className="mt-1">
                      Lat: {testResults.location.coords.lat.toFixed(4)}, 
                      Lng: {testResults.location.coords.lng.toFixed(4)}
                    </div>
                  )}
                  {testResults.location.data && (
                    <div className="mt-1 text-xs opacity-75">
                      Code: {testResults.location.data.errorCode} ({testResults.location.data.codeExplanation})
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">Console</div>
              <div className="bg-gray-50 p-2 rounded text-gray-600">
                Check browser DevTools (F12) → Console for detailed logs
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
