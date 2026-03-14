/**
 * Scheduling Optimization Algorithm
 * Based on the KMRL Plan.md:
 * "required_trains = predicted_passengers / train_capacity"
 * "minimize waiting time, maximize train utilization, reduce overcrowding"
 */

const TRAIN_CAPACITY = 250;
const MIN_HEADWAY_MINS = 5;
const MAX_HEADWAY_MINS = 20;

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

  return {
    dispatchInterval,
    requiredTrains,
    trainCapacity: TRAIN_CAPACITY,
    utilizationPercent: Math.min(100, Math.round((predicted_passengers / (requiredTrains * TRAIN_CAPACITY)) * 100))
  };
}

module.exports = { optimizeSchedule };
