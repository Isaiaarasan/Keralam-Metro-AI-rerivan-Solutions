export const demandData = [
  { time: '06:00', station_a: 120, station_b: 80, station_c: 50 },
  { time: '07:00', station_a: 350, station_b: 220, station_c: 150 },
  { time: '08:00', station_a: 850, station_b: 620, station_c: 450 },
  { time: '09:00', station_a: 920, station_b: 750, station_c: 600 },
  { time: '10:00', station_a: 500, station_b: 450, station_c: 400 },
  { time: '11:00', station_a: 300, station_b: 280, station_c: 250 },
  { time: '12:00', station_a: 250, station_b: 250, station_c: 200 },
  { time: '13:00', station_a: 280, station_b: 300, station_c: 280 },
  { time: '14:00', station_a: 290, station_b: 310, station_c: 300 },
  { time: '15:00', station_a: 350, station_b: 400, station_c: 380 },
  { time: '16:00', station_a: 500, station_b: 550, station_c: 500 },
  { time: '17:00', station_a: 850, station_b: 800, station_c: 900 },
  { time: '18:00', station_a: 950, station_b: 880, station_c: 950 },
  { time: '19:00', station_a: 600, station_b: 550, station_c: 700 },
  { time: '20:00', station_a: 300, station_b: 250, station_c: 400 },
];

export const scheduleData = [
  { time: '08:00', current_frequency: 10, recommended_frequency: 5, trains_needed: 12 },
  { time: '09:00', current_frequency: 10, recommended_frequency: 5, trains_needed: 14 },
  { time: '10:00', current_frequency: 10, recommended_frequency: 8, trains_needed: 8 },
  { time: '11:00', current_frequency: 15, recommended_frequency: 12, trains_needed: 5 },
  { time: '12:00', current_frequency: 15, recommended_frequency: 15, trains_needed: 4 },
];

export const stationStatus = [
  { id: 1, name: 'Station Alpha', status: 'Crowded', load: 85, trend: 'increasing' },
  { id: 2, name: 'Station Beta', status: 'Normal', load: 60, trend: 'stable' },
  { id: 3, name: 'Station Gamma', status: 'Highly Crowded', load: 92, trend: 'increasing' },
  { id: 4, name: 'Station Delta', status: 'Normal', load: 55, trend: 'decreasing' },
  { id: 5, name: 'Station Epsilon', status: 'Normal', load: 45, trend: 'stable' },
];
