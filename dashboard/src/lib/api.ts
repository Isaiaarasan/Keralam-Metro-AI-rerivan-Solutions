export const BASE_URL = 'http://127.0.0.1:3001';

export async function fetchStations() {
  const res = await fetch(`${BASE_URL}/stations`);
  return res.json();
}

export async function fetchPredictionsForToday() {
  const stations = await fetchStations();
  const reqs = [];
  const today = new Date();
  const day_of_week = today.getDay();
  const weekend_flag = [0,6].includes(day_of_week) ? 1 : 0;
  
  // Predict for hours 6 to 22 (operating hours)
  for(let hour=6; hour<=22; hour++) {
    for (const station of stations) {
      reqs.push({ station_id: station.station_id, hour, day_of_week, weekend_flag });
    }
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
    const hourEntry: any = { time: timeStr };
    
    stations.forEach((s: any) => {
      const pred = rawData.find((r: any) => r.hour === hour && r.station_id === s.station_id);
      // Create a slug like 'station_alpha' from 'Station Alpha'
      const key = s.station_name.toLowerCase().replace(/\s+/g, '_');
      hourEntry[key] = pred ? pred.predicted_passengers : 0;
      hourEntry[`${key}_name`] = s.station_name; // Store full name for tooltips
    });
    
    chartData.push(hourEntry);
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

export async function fetchSummary() {
  const res = await fetch(`${BASE_URL}/summary`);
  return res.json();
}
