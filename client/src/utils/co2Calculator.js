// Client emission factors (kg CO2 per unit) matching the server formulas
export const CLIENT_EMISSION_FACTORS = {
  car: {
    petrol: 0.21,
    diesel: 0.17,
    electric: 0.05,
    none: 0
  },
  flight: {
    short: 0.255,
    long: 0.195
  },
  diet: {
    vegan: 2.5,
    vegetarian: 3.8,
    omnivore: 5.5,
    heavy_meat: 7.2
  },
  energy: {
    renewable: 0.23,
    mixed: 0.525,
    fossil: 0.82
  },
  shopping: {
    clothing: 10,
    delivery: 3
  }
};

export const calculateTransportEstimate = (carType, distanceKm) => {
  const factor = CLIENT_EMISSION_FACTORS.car[carType] || 0;
  return distanceKm * factor;
};

export const calculateFlightEstimate = (flightType, flightDistanceKm) => {
  const typeKey = flightType === 'long' || flightDistanceKm > 1500 ? 'long' : 'short';
  const factor = CLIENT_EMISSION_FACTORS.flight[typeKey];
  return flightDistanceKm * factor;
};

export const calculateEnergyEstimate = (kwh, source) => {
  const factor = CLIENT_EMISSION_FACTORS.energy[source] || CLIENT_EMISSION_FACTORS.energy.fossil;
  return kwh * factor;
};

export const calculateShoppingEstimate = (clothingItems, onlineOrders) => {
  return (clothingItems * CLIENT_EMISSION_FACTORS.shopping.clothing) + 
         (onlineOrders * CLIENT_EMISSION_FACTORS.shopping.delivery);
};
