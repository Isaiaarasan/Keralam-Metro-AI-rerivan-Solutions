/**
 * Scheduling Optimization Algorithm
 * Based on the KMRL Plan.md:
 * "required_trains = predicted_passengers / train_capacity"
 * "minimize waiting time, maximize train utilization, reduce overcrowding"
 */

const TRAIN_CAPACITY = 250;
const MIN_HEADWAY_MINS = 5;
const MAX_HEADWAY_MINS = 20;

// Energy constants
const KWH_PER_TRIP = 120; // assumed kWh per train trip across the line
const CO2_KG_PER_KWH = 0.4; // assumed kg of CO2 per kWh on local grid
const STATIC_BASE_TRAINS_PER_HOUR = 4; // assumed 15min static schedule baseline

function optimizeSchedule(predicted_passengers) {
  // Base rule: required_trains = predicted_passengers / train_capacity
  let requiredTrains = Math.ceil(predicted_passengers / TRAIN_CAPACITY);
  
  // Guarantee at least 1 train runs per hour regardless of demand
  if (requiredTrains < 1) requiredTrains = 1;
  
  // Dispatch interval = 60 minutes / required trains
  let dispatchInterval = Math.floor(60 / requiredTrains);
  
  // Impose constraints (no faster than 5 mins, no slower than 20 mins)
  if (dispatchInterval < MIN_HEADWAY_MINS) {
    dispatchInterval = MIN_HEADWAY_MINS;
    requiredTrains = Math.ceil(60 / MIN_HEADWAY_MINS); 
  }
  
  if (dispatchInterval > MAX_HEADWAY_MINS) {
    dispatchInterval = MAX_HEADWAY_MINS;
    requiredTrains = Math.ceil(60 / MAX_HEADWAY_MINS);
  }

  // Energy & Env Calculations
  const baselineEnergy = STATIC_BASE_TRAINS_PER_HOUR * KWH_PER_TRIP;
  const proposedEnergy = requiredTrains * KWH_PER_TRIP;
  const energySavedKwh = baselineEnergy - proposedEnergy;
  const co2SavedKg = Number((energySavedKwh * CO2_KG_PER_KWH).toFixed(2));

  return {
    dispatchInterval,
    requiredTrains,
    trainCapacity: TRAIN_CAPACITY,
    utilizationPercent: Math.min(100, Math.round((predicted_passengers / (requiredTrains * TRAIN_CAPACITY)) * 100)),
    energy: {
      proposedKwh: proposedEnergy,
      baselineKwh: baselineEnergy,
      savedKwh: energySavedKwh,
      co2SavedKg
    }
  };
}

module.exports = { optimizeSchedule };
