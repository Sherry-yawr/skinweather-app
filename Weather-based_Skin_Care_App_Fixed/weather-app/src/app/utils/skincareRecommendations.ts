interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  location: string;
}

interface RoutineStep {
  step: number;
  name: string;
  product: string;
  reason: string;
}

interface SkincareRecommendation {
  morning: RoutineStep[];
  evening: RoutineStep[];
  tips: string[];
}

export function getSkincareRecommendations(weather: WeatherData): SkincareRecommendation {
  const { temperature, humidity, uvIndex, condition, season } = weather;

  // Determine skin needs based on weather
  const isDry = humidity < 40 || temperature < 10;
  const isHumid = humidity > 70;
  const isHot = temperature > 25;
  const isCold = temperature < 10;
  const highUV = uvIndex > 5;

  // Morning Routine
  const morning: RoutineStep[] = [
    {
      step: 1,
      name: 'Gentle Cleanser',
      product: isDry ? 'Cream-based cleanser' : isHumid ? 'Foaming gel cleanser' : 'Gentle gel cleanser',
      reason: isDry ? 'Protects skin barrier in dry conditions' : isHumid ? 'Removes excess oil without stripping' : 'Maintains balanced cleansing'
    },
    {
      step: 2,
      name: 'Toner',
      product: isDry ? 'Hydrating toner with hyaluronic acid' : 'Balancing toner',
      reason: 'Prepares skin and restores pH balance'
    },
    {
      step: 3,
      name: 'Serum',
      product: isDry ? 'Hydrating serum with ceramides' : isHumid ? 'Lightweight vitamin C serum' : 'Antioxidant serum',
      reason: isDry ? 'Deep hydration for dry weather' : 'Protects against environmental damage'
    },
    {
      step: 4,
      name: 'Moisturizer',
      product: isDry || isCold ? 'Rich cream moisturizer' : isHumid ? 'Light gel moisturizer' : 'Medium-weight lotion',
      reason: isDry || isCold ? 'Locks in moisture during harsh conditions' : isHumid ? 'Hydrates without heaviness' : 'Balanced hydration'
    },
    {
      step: 5,
      name: 'Sunscreen',
      product: highUV ? 'SPF 50+ broad spectrum' : 'SPF 30 broad spectrum',
      reason: highUV ? 'Essential protection from high UV exposure' : 'Daily UV protection is crucial year-round'
    }
  ];

  // Evening Routine
  const evening: RoutineStep[] = [
    {
      step: 1,
      name: 'Double Cleanse',
      product: 'Oil cleanser followed by gentle foaming cleanser',
      reason: 'Removes sunscreen, makeup, and daily pollutants'
    },
    {
      step: 2,
      name: 'Exfoliant',
      product: isDry ? 'Gentle lactic acid (2x per week)' : 'Chemical exfoliant with AHA/BHA (2-3x per week)',
      reason: isDry ? 'Mild exfoliation for sensitive, dry skin' : 'Removes dead skin cells and unclogs pores'
    },
    {
      step: 3,
      name: 'Treatment',
      product: isCold ? 'Nourishing facial oil' : isHot ? 'Soothing aloe gel' : 'Targeted treatment serum',
      reason: isCold ? 'Extra nourishment for cold-stressed skin' : isHot ? 'Calms heat-stressed skin' : 'Addresses specific concerns'
    },
    {
      step: 4,
      name: 'Night Moisturizer',
      product: isDry || isCold ? 'Rich night cream with peptides' : 'Restorative night cream',
      reason: 'Supports skin repair overnight'
    },
    {
      step: 5,
      name: 'Eye Cream',
      product: 'Hydrating eye cream',
      reason: 'Targets delicate eye area, prevents fine lines'
    }
  ];

  // Weather-specific tips
  const tips: string[] = [];

  if (highUV) {
    tips.push('Reapply sunscreen every 2 hours when outdoors. Consider wearing a hat and sunglasses.');
  }

  if (isDry) {
    tips.push('Use a humidifier indoors to add moisture to the air. Drink plenty of water to hydrate from within.');
    tips.push('Avoid hot showers which can further dry out skin. Use lukewarm water instead.');
  }

  if (isHumid) {
    tips.push('Use blotting papers throughout the day to manage excess oil. Consider a mattifying primer.');
    tips.push('Opt for lightweight, non-comedogenic products to prevent clogged pores.');
  }

  if (isCold) {
    tips.push('Protect exposed skin with scarves and gloves. Apply moisturizer before going outside.');
    tips.push('Look for products with shea butter or oils to create a protective barrier.');
  }

  if (isHot) {
    tips.push('Keep a facial mist in your bag for refreshing hydration throughout the day.');
    tips.push('Store your skincare in the fridge for an extra cooling effect.');
  }

  if (condition === 'windy') {
    tips.push('Wind can be dehydrating. Apply a protective barrier cream before going outside.');
  }

  if (season === 'winter') {
    tips.push('Switch to richer, more emollient products. Your skin needs extra protection in winter.');
  } else if (season === 'summer') {
    tips.push('Lighter formulas work best in summer. Don\'t forget to apply sunscreen to often-missed areas like ears and neck.');
  } else if (season === 'spring') {
    tips.push('Spring allergies can affect skin. Look for soothing ingredients like chamomile and calendula.');
  } else if (season === 'fall') {
    tips.push('Transition your routine gradually. Start incorporating richer products as weather cools.');
  }

  return { morning, evening, tips };
}

// Mock weather data for different cities
export function getMockWeatherData(city: string): WeatherData {
  const weatherPatterns: Record<string, WeatherData> = {
    'New York': {
      temperature: 8,
      humidity: 45,
      uvIndex: 3,
      condition: 'cloudy',
      season: 'winter',
      location: 'New York, NY'
    },
    'Los Angeles': {
      temperature: 22,
      humidity: 55,
      uvIndex: 7,
      condition: 'sunny',
      season: 'winter',
      location: 'Los Angeles, CA'
    },
    'Miami': {
      temperature: 28,
      humidity: 75,
      uvIndex: 9,
      condition: 'sunny',
      season: 'winter',
      location: 'Miami, FL'
    },
    'Seattle': {
      temperature: 10,
      humidity: 80,
      uvIndex: 2,
      condition: 'rainy',
      season: 'winter',
      location: 'Seattle, WA'
    },
    'Chicago': {
      temperature: 2,
      humidity: 35,
      uvIndex: 2,
      condition: 'snowy',
      season: 'winter',
      location: 'Chicago, IL'
    },
    'Denver': {
      temperature: 5,
      humidity: 25,
      uvIndex: 4,
      condition: 'sunny',
      season: 'winter',
      location: 'Denver, CO'
    },
    'Phoenix': {
      temperature: 18,
      humidity: 30,
      uvIndex: 6,
      condition: 'sunny',
      season: 'winter',
      location: 'Phoenix, AZ'
    },
    'Boston': {
      temperature: 4,
      humidity: 50,
      uvIndex: 2,
      condition: 'snowy',
      season: 'winter',
      location: 'Boston, MA'
    },
    'London': {
      temperature: 7,
      humidity: 70,
      uvIndex: 1,
      condition: 'cloudy',
      season: 'winter',
      location: 'London, UK'
    },
    'Tokyo': {
      temperature: 9,
      humidity: 45,
      uvIndex: 3,
      condition: 'cloudy',
      season: 'winter',
      location: 'Tokyo, Japan'
    },
    'Sydney': {
      temperature: 26,
      humidity: 65,
      uvIndex: 10,
      condition: 'sunny',
      season: 'summer',
      location: 'Sydney, Australia'
    },
    'Dubai': {
      temperature: 24,
      humidity: 60,
      uvIndex: 8,
      condition: 'sunny',
      season: 'winter',
      location: 'Dubai, UAE'
    }
  };

  return weatherPatterns[city] || {
    temperature: 20,
    humidity: 50,
    uvIndex: 5,
    condition: 'cloudy',
    season: 'spring',
    location: city
  };
}
