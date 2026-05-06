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

interface ProductRecommendation {
  category: string;
  productName: string;
  brand: string;
  description: string;
  purchaseUrl: string;
}

interface SkincareRecommendation {
  morning: RoutineStep[];
  evening: RoutineStep[];
  tips: string[];
  suggestedProducts: ProductRecommendation[];
}

export function getSkincareRecommendations(weather: WeatherData): SkincareRecommendation {
  const { temperature, humidity, uvIndex, condition, season } = weather;

  // Determine skin needs based on weather
  const isDry = humidity < 40 || temperature < 10;
  const isVeryDry = humidity < 30;
  const isHumid = humidity > 70;
  const isVeryHumid = humidity > 80;
  const isHot = temperature > 25;
  const isCold = temperature < 10;
  const isVeryCold = temperature < 0;
  const highUV = uvIndex > 5;
  const veryHighUV = uvIndex > 8;

  // Morning Routine - Build dynamically (max 4 steps)
  const morning: RoutineStep[] = [];
  let stepNumber = 1;

  // Step 1: Always cleanse
  morning.push({
    step: stepNumber++,
    name: 'Cleanser',
    product: isDry ? 'Cream-based cleanser' : isHumid ? 'Foaming gel cleanser' : 'Gentle gel cleanser',
    reason: isDry ? 'Protects skin barrier in dry conditions' : isHumid ? 'Removes excess oil without stripping' : 'Maintains balanced cleansing'
  });

  // Step 2: Serum (conditional - only for specific weather)
  if (isVeryDry || isVeryHumid || highUV) {
    morning.push({
      step: stepNumber++,
      name: 'Serum',
      product: isVeryDry ? 'Hyaluronic acid + ceramide serum' : isVeryHumid ? 'Niacinamide pore control serum' : 'Vitamin C antioxidant serum',
      reason: isVeryDry ? 'Intense hydration for very dry conditions' : isVeryHumid ? 'Controls excess oil and minimizes pores' : 'Protects against UV and environmental damage'
    });
  }

  // Step 3: Moisturizer (always included)
  morning.push({
    step: stepNumber++,
    name: 'Moisturizer',
    product: isDry || isCold ? 'Rich cream moisturizer' : isHumid ? 'Light gel moisturizer' : 'Medium-weight lotion',
    reason: isDry || isCold ? 'Locks in moisture during harsh conditions' : isHumid ? 'Hydrates without heaviness' : 'Balanced hydration'
  });

  // Step 4: Sunscreen (always included)
  morning.push({
    step: stepNumber++,
    name: 'Sunscreen',
    product: highUV ? 'SPF 50+ broad spectrum' : 'SPF 30 broad spectrum',
    reason: highUV ? 'Essential protection from high UV exposure' : 'Daily UV protection is crucial year-round'
  });

  // Evening Routine - Build dynamically (max 4 steps)
  const evening: RoutineStep[] = [];
  stepNumber = 1;

  // Step 1: Always cleanse
  evening.push({
    step: stepNumber++,
    name: 'Cleanser',
    product: 'Oil cleanser or micellar water',
    reason: 'Removes sunscreen, makeup, and daily pollutants'
  });

  // Step 2: Treatment (conditional - only for extreme conditions)
  if (veryHighUV) {
    evening.push({
      step: stepNumber++,
      name: 'Soothing Serum',
      product: 'Aloe vera or centella serum',
      reason: 'Calms and repairs sun-stressed skin'
    });
  } else if (isVeryCold || isVeryDry) {
    evening.push({
      step: stepNumber++,
      name: 'Repair Serum',
      product: 'Ceramide and peptide serum',
      reason: 'Strengthens skin barrier damaged by harsh cold and dryness'
    });
  } else if (isVeryHumid) {
    evening.push({
      step: stepNumber++,
      name: 'Exfoliant',
      product: 'AHA/BHA exfoliant (2-3x per week)',
      reason: 'Unclogs pores and controls excess oil from humidity'
    });
  }

  // Step 3: Night cream (always included)
  evening.push({
    step: stepNumber++,
    name: 'Night Cream',
    product: isDry || isCold ? 'Rich night cream with retinol' : isHumid ? 'Lightweight night gel' : 'Restorative night cream',
    reason: isDry || isCold ? 'Deep nourishment for harsh weather recovery' : 'Supports skin repair overnight'
  });

  // Step 4: Optional sleeping mask for extreme conditions
  if (isVeryCold && isVeryDry) {
    evening.push({
      step: stepNumber++,
      name: 'Sleeping Mask',
      product: 'Occlusive sleeping mask',
      reason: 'Seals in moisture during extreme cold and dryness'
    });
  }

  // Suggested Products based on weather conditions
  const suggestedProducts: ProductRecommendation[] = [];

  // Cleanser recommendation
  if (isDry) {
    suggestedProducts.push({
      category: 'Cleanser',
      productName: 'Hydrating Facial Cleanser',
      brand: 'CeraVe',
      description: 'Gentle, non-foaming cleanser with ceramides and hyaluronic acid',
      purchaseUrl: 'https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser'
    });
  } else if (isHumid) {
    suggestedProducts.push({
      category: 'Cleanser',
      productName: 'Effaclar Purifying Foaming Gel',
      brand: 'La Roche-Posay',
      description: 'Oil-free foaming cleanser for oily, sensitive skin',
      purchaseUrl: 'https://www.laroche-posay.us/our-products/face/face-wash/effaclar-purifying-foaming-gel-cleanser-for-oily-skin-3337875545859.html'
    });
  } else {
    suggestedProducts.push({
      category: 'Cleanser',
      productName: 'Ultra Facial Cleanser',
      brand: 'Kiehl\'s',
      description: 'Gentle cleanser suitable for all skin types',
      purchaseUrl: 'https://www.kiehls.com/skincare/cleansers-scrubs/ultra-facial-cleanser/622.html'
    });
  }

  // Serum recommendation
  if (isVeryDry) {
    suggestedProducts.push({
      category: 'Serum',
      productName: 'Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      description: 'Deep hydration serum with multiple molecular weights of HA',
      purchaseUrl: 'https://theordinary.com/en-us/hyaluronic-acid-2-b5-hydration-support-serum-100411.html'
    });
  } else if (isVeryHumid) {
    suggestedProducts.push({
      category: 'Serum',
      productName: 'Niacinamide 10% + Zinc 1%',
      brand: 'The Ordinary',
      description: 'Controls oil production and minimizes pores',
      purchaseUrl: 'https://theordinary.com/en-us/niacinamide-10-zinc-1-oil-control-serum-100436.html'
    });
  } else if (highUV) {
    suggestedProducts.push({
      category: 'Serum',
      productName: 'C E Ferulic',
      brand: 'SkinCeuticals',
      description: 'Antioxidant serum that protects against environmental damage',
      purchaseUrl: 'https://www.skinceuticals.com/c-e-ferulic-635494263008.html'
    });
  }

  // Moisturizer recommendation
  if (isDry || isCold) {
    suggestedProducts.push({
      category: 'Moisturizer',
      productName: 'Moisturizing Cream',
      brand: 'CeraVe',
      description: 'Rich cream with ceramides for 24-hour hydration',
      purchaseUrl: 'https://www.cerave.com/skincare/moisturizers/moisturizing-cream'
    });
  } else if (isHumid) {
    suggestedProducts.push({
      category: 'Moisturizer',
      productName: 'Dramatically Different Hydrating Jelly',
      brand: 'Clinique',
      description: 'Oil-free gel that provides lightweight hydration',
      purchaseUrl: 'https://www.clinique.com/product/1687/38984/skin-care/moisturizers/dramatically-different-hydrating-jelly'
    });
  } else {
    suggestedProducts.push({
      category: 'Moisturizer',
      productName: 'Daily Moisturizing Lotion',
      brand: 'Cetaphil',
      description: 'Lightweight, non-greasy daily moisturizer',
      purchaseUrl: 'https://www.cetaphil.com/us/moisturizers/daily-facial-moisturizer/302993927044.html'
    });
  }

  // Sunscreen recommendation
  if (highUV) {
    suggestedProducts.push({
      category: 'Sunscreen',
      productName: 'Anthelios Melt-in Milk SPF 100',
      brand: 'La Roche-Posay',
      description: 'Very high protection, water-resistant sunscreen',
      purchaseUrl: 'https://www.laroche-posay.us/our-products/sun/face-sunscreen/anthelios-melt-in-milk-sunscreen-spf-100-3606000537415.html'
    });
  } else {
    suggestedProducts.push({
      category: 'Sunscreen',
      productName: 'UV Clear SPF 46',
      brand: 'EltaMD',
      description: 'Broad-spectrum, oil-free facial sunscreen',
      purchaseUrl: 'https://eltamd.com/products/uv-clear-broad-spectrum-spf-46'
    });
  }

  // Evening treatment recommendation
  if (veryHighUV) {
    suggestedProducts.push({
      category: 'Night Treatment',
      productName: 'Cicaplast Baume B5',
      brand: 'La Roche-Posay',
      description: 'Soothing balm that repairs and calms irritated skin',
      purchaseUrl: 'https://www.laroche-posay.us/our-products/face/face-moisturizer/cicaplast-baume-b5-soothing-therapeutic-multi-purpose-cream-3337875545891.html'
    });
  } else if (isVeryCold || isVeryDry) {
    suggestedProducts.push({
      category: 'Night Treatment',
      productName: 'Advanced Night Repair',
      brand: 'Estée Lauder',
      description: 'Intensive repair serum with proven anti-aging benefits',
      purchaseUrl: 'https://www.esteelauder.com/product/681/22670/product-catalog/skincare/advanced-night-repair'
    });
  }

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

  return { morning, evening, tips, suggestedProducts };
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
