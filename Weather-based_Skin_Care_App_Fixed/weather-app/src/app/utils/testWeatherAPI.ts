// Test function to verify Open-Meteo API connectivity (no API key needed)
export async function testOpenWeatherAPI(_apiKey: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Test with New York coordinates using Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,relative_humidity_2m,weathercode&timezone=auto&forecast_days=1`
    );

    if (!response.ok) {
      return {
        success: false,
        message: `API Error ${response.status}`,
      };
    }

    const data = await response.json();
    const current = data.current;
    return {
      success: true,
      message: 'Open-Meteo API is working correctly!',
      data: {
        location: 'New York, US',
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        weatherCode: current.weathercode
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Test geolocation
export async function testGeolocation(): Promise<{ success: boolean; message: string; coords?: { lat: number; lng: number } }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        message: 'Geolocation is not supported by your browser'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          message: 'Location access granted successfully!',
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },
      (positionError) => {
        const errorCode = positionError?.code;
        const errorMsg = positionError?.message;

        let message = 'Failed to get location: ';
        if (errorCode === 1) {
          message += "Permission denied. Click the location icon in your browser's address bar to allow access.";
        } else if (errorCode === 2) {
          message += 'Position unavailable. Check if location services are enabled on your device.';
        } else if (errorCode === 3) {
          message += 'Request timed out. Your device may be taking too long to determine location.';
        } else {
          message += errorMsg || 'Unknown error occurred';
        }

        resolve({
          success: false,
          message,
          data: {
            errorCode,
            errorMessage: errorMsg,
            codeExplanation: errorCode === 1 ? 'PERMISSION_DENIED' : errorCode === 2 ? 'POSITION_UNAVAILABLE' : errorCode === 3 ? 'TIMEOUT' : 'UNKNOWN'
          }
        } as any);
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  });
}
