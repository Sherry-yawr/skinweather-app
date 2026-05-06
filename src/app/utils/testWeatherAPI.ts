// Test function to verify API connectivity
export async function testOpenWeatherAPI(apiKey: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Test with a known location (New York)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=New York&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: `API Error ${response.status}: ${errorData.message || 'Unknown error'}`,
        data: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'API is working correctly!',
      data: {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0].description
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
          message += 'Permission denied by user. Click the location icon in your browser\'s address bar to allow access.';
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
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }
    );
  });
}
