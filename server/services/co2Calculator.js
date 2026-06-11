// Emission factors (kg CO2 per unit)
export const EMISSION_FACTORS = {
  car: {
    petrol: 0.21,   // kg/km
    diesel: 0.17,   // kg/km
    electric: 0.05, // kg/km
    none: 0
  },
  flight: {
    short: 0.255,   // kg/km (<= 1500 km)
    long: 0.195     // kg/km (> 1500 km)
  },
  diet: {
    vegan: 2.5,        // kg/day
    vegetarian: 3.8,   // kg/day
    omnivore: 5.5,     // kg/day
    heavy_meat: 7.2,   // kg/day
    "heavy meat": 7.2
  },
  energy: {
    renewable: 0.23, // kg/kWh
    mixed: 0.525,    // kg/kWh (average of renewable and grid)
    fossil: 0.82     // kg/kWh (India grid average)
  },
  shopping: {
    clothing: 10,    // kg per item
    delivery: 3      // kg per online order
  }
};

/**
 * Calculates CO2 for Transport
 */
export const calculateTransportCO2 = ({ type, carType, distanceKm, flightType, flightDistanceKm }) => {
  if (type === 'car') {
    const factor = EMISSION_FACTORS.car[carType] || 0;
    return distanceKm * factor;
  } else if (type === 'flight') {
    const typeKey = flightType === 'long' || flightDistanceKm > 1500 ? 'long' : 'short';
    const factor = EMISSION_FACTORS.flight[typeKey];
    return flightDistanceKm * factor;
  }
  return 0;
};

/**
 * Calculates CO2 for Diet
 */
export const calculateDietCO2 = (dietType, days = 1) => {
  const factor = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.omnivore;
  return factor * days;
};

/**
 * Calculates CO2 for Energy
 */
export const calculateEnergyCO2 = (kwh, source) => {
  const factor = EMISSION_FACTORS.energy[source] || EMISSION_FACTORS.energy.fossil;
  return kwh * factor;
};

/**
 * Calculates CO2 for Shopping
 */
export const calculateShoppingCO2 = ({ clothingItems = 0, onlineOrders = 0 }) => {
  return (clothingItems * EMISSION_FACTORS.shopping.clothing) + (onlineOrders * EMISSION_FACTORS.shopping.delivery);
};

/**
 * Estimates annual carbon footprint (in kg CO2) based on onboarding quiz answers
 */
export const estimateAnnualBaseline = (quizData) => {
  const { transport, diet, energy, shopping } = quizData;

  // 1. Transport Annual
  let transportAnnual = 0;
  if (transport.carType && transport.carType !== 'none') {
    const carFactor = EMISSION_FACTORS.car[transport.carType] || 0;
    transportAnnual += (transport.weeklyKm * 52) * carFactor;
  }
  // Assume average flight distance is 2000 km (mix of short and long haul)
  if (transport.flightsPerYear) {
    const flightFactor = EMISSION_FACTORS.flight.short; // fallback short haul
    transportAnnual += (transport.flightsPerYear * 1500) * flightFactor; // average 1500 km per flight
  }

  // 2. Diet Annual
  const dietAnnual = calculateDietCO2(diet, 365);

  // 3. Energy Annual
  // Estimate kWh based on house size: Small = 150 kWh/mo, Medium = 300 kWh/mo, Large = 500 kWh/mo
  let estimatedMonthlyKwh = 300;
  const houseSize = (energy.houseSize || '').toLowerCase();
  if (houseSize.includes('small')) {
    estimatedMonthlyKwh = 150;
  } else if (houseSize.includes('large')) {
    estimatedMonthlyKwh = 500;
  }
  const energyFactor = EMISSION_FACTORS.energy[energy.energySource] || EMISSION_FACTORS.energy.fossil;
  const energyAnnual = estimatedMonthlyKwh * 12 * energyFactor;

  // 4. Shopping Annual
  const clothingAnnual = (shopping.clothesPerMonth || 0) * 12 * EMISSION_FACTORS.shopping.clothing;
  const deliveryAnnual = (shopping.onlineOrdersPerMonth || 0) * 12 * EMISSION_FACTORS.shopping.delivery;
  // Assume a default for electronics (e.g., 1 device/year = 80kg co2)
  const electronicsAnnual = 80;
  const shoppingAnnual = clothingAnnual + deliveryAnnual + electronicsAnnual;

  return Math.round(transportAnnual + dietAnnual + energyAnnual + shoppingAnnual);
};
