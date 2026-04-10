export const BASE_URL = 'http://localhost:3001';

export async function fetchStations() {
  const res = await fetch(`${BASE_URL}/stations`);
  return res.json();
}

export async function fetchPredictionsForToday() {
  const reqs = [];
  const today = new Date();
  const day_of_week = today.getDay();
  const weekend_flag = [0,6].includes(day_of_week) ? 1 : 0;
  
  // Predict for hours 6 to 22 (operating hours)
  for(let hour=6; hour<=22; hour++) {
    reqs.push({ station_id: 1, hour, day_of_week, weekend_flag });
    reqs.push({ station_id: 2, hour, day_of_week, weekend_flag });
    reqs.push({ station_id: 3, hour, day_of_week, weekend_flag });
  }

  const res = await fetch(`${BASE_URL}/predict-demand-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: reqs })
  });
  
  const rawData = await res.json();
  
  const chartData = [];
  for(let hour=6; hour<=22; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const station_a = rawData.find((r: any) => r.hour === hour && r.station_id === 1)?.predicted_passengers || 0;
    const station_b = rawData.find((r: any) => r.hour === hour && r.station_id === 2)?.predicted_passengers || 0;
    const station_c = rawData.find((r: any) => r.hour === hour && r.station_id === 3)?.predicted_passengers || 0;
    
    chartData.push({ time: timeStr, station_a, station_b, station_c });
  }
  return chartData;
}

export async function fetchSchedule(predicted_passengers: number) {
  const res = await fetch(`${BASE_URL}/schedule?predicted_passengers=${predicted_passengers}`);
  return res.json();
}

export async function fetchPassengerData() {
  const res = await fetch(`${BASE_URL}/passenger-data?limit=1000`);
  return res.json();
}
