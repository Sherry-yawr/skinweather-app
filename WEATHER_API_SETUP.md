# Weather API Setup Guide

This app supports real weather data from two providers. Choose one and follow the setup instructions.

## Option 1: OpenWeatherMap (Recommended)

### Steps:
1. **Sign up for a free API key:**
   - Go to https://openweathermap.org/api
   - Click "Sign Up" and create a free account
   - After email verification, go to your API keys page
   - Copy your API key

2. **Add the API key to the app:**
   - Open `/src/app/utils/weatherAPI.ts`
   - Find the line: `const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key (keep the quotes)
   - Example: `const OPENWEATHER_API_KEY = 'abc123def456ghi789';`

3. **Test it:**
   - Click "Use My Location" button in the app
   - Allow location access when prompted
   - The app will fetch real weather data!

### Free Tier Limits:
- 1,000 API calls per day
- 60 calls per minute
- Perfect for personal use

### API Endpoints Used:
- Current Weather: `/data/2.5/weather`
- UV Index: `/data/2.5/uvi`
- Geocoding: `/geo/1.0/direct`

---

## Option 2: WeatherAPI.com (Alternative)

### Steps:
1. **Sign up for a free API key:**
   - Go to https://www.weatherapi.com/signup.aspx
   - Create a free account
   - Copy your API key from the dashboard

2. **Update the code:**
   - Open `/src/app/utils/weatherAPI.ts`
   - Find: `const WEATHERAPI_KEY = 'YOUR_WEATHERAPI_KEY_HERE';`
   - Replace with your actual API key

3. **Switch to WeatherAPI in App.tsx:**
   - Open `/src/app/App.tsx`
   - Find the import: `import { getWeatherByCity, getWeatherByCoordinates } from './utils/weatherAPI';`
   - Change the function calls to use `getWeatherByCoordinatesWeatherAPI` instead

### Free Tier Limits:
- 1 million calls per month
- More generous than OpenWeatherMap

---

## Demo Mode (No API Key Needed)

If you don't have an API key, the app works in **demo mode** with mock weather data:
- Simulates weather conditions
- Works without internet
- Great for testing the UI
- Shows realistic data patterns

---

## Troubleshooting

### "Please add your API key" error:
- Make sure you replaced `'YOUR_API_KEY_HERE'` with your actual key
- Keep the quotes around the key
- Save the file after editing

### "Failed to fetch weather data":
- Check if your API key is valid
- Verify your internet connection
- Make sure you haven't exceeded the free tier limits
- OpenWeatherMap keys can take 10 minutes to activate after signup

### Location access denied:
- Enable location services in your browser settings
- Click the location icon in the address bar
- Select "Allow" for this site

### CORS errors (if testing locally):
- These APIs support CORS for browser requests
- If you see CORS errors, try using HTTPS instead of HTTP

---

## API Key Security

⚠️ **Important**: This implementation exposes API keys in the frontend code, which is fine for:
- Personal projects
- Learning/demos
- Free tier usage

For production apps with payment-based API plans:
- Move API calls to a backend server
- Use environment variables
- Implement rate limiting
- Never commit API keys to public repositories

---

## Cost Estimate

Both services offer generous free tiers:

| Service | Free Tier | Typical Usage |
|---------|-----------|---------------|
| OpenWeatherMap | 1,000 calls/day | ~40 users/day refreshing hourly |
| WeatherAPI.com | 1M calls/month | ~33,000 users/month |

For this skincare app:
- Auto-refreshes every 10 minutes (with real weather)
- ~144 calls per user per day max
- Plenty for personal use on free tier

---

## Need Help?

- OpenWeatherMap Docs: https://openweathermap.org/api
- WeatherAPI.com Docs: https://www.weatherapi.com/docs/
- For issues, check the browser console for error messages
