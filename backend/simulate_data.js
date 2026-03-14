const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');

// Remove existing DB to start fresh
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

const stations = [
  { id: 1, name: 'Aluva', location: '10.1090, 76.3491', line: 'Blue' },
  { id: 2, name: 'Edapally', location: '10.0261, 76.3073', line: 'Blue' },
  { id: 3, name: 'MG Road', location: '9.9757, 76.2801', line: 'Blue' },
  { id: 4, name: 'Vyttila', location: '9.9674, 76.3193', line: 'Blue' },
  { id: 5, name: 'Kaloor', location: '9.9880, 76.2946', line: 'Blue' }
];

db.serialize(() => {
  // 1. Create Tables
  db.run(`CREATE TABLE IF NOT EXISTS stations (
    station_id INTEGER PRIMARY KEY,
    station_name TEXT,
    location TEXT,
    line TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS passenger_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER,
    date TEXT,
    time_slot TEXT,
    hour INTEGER,
    day_of_week INTEGER,
    weekend_flag INTEGER,
    passenger_count INTEGER,
    FOREIGN KEY(station_id) REFERENCES stations(station_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS predictions (
    prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER,
    time_slot TEXT,
    predicted_passengers INTEGER,
    FOREIGN KEY(station_id) REFERENCES stations(station_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS train_schedule (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id TEXT,
    departure_station INTEGER,
    departure_time TEXT,
    arrival_station INTEGER,
    status TEXT,
    FOREIGN KEY(departure_station) REFERENCES stations(station_id),
    FOREIGN KEY(arrival_station) REFERENCES stations(station_id)
  )`);

  // 2. Insert Stations
  const stmt = db.prepare(`INSERT INTO stations VALUES (?, ?, ?, ?)`);
  stations.forEach(s => {
    stmt.run(s.id, s.name, s.location, s.line);
  });
  stmt.finalize();

  // 3. Simulate Passenger Data (Past 30 Days)
  const insertPassenger = db.prepare(`INSERT INTO passenger_data 
    (station_id, date, time_slot, hour, day_of_week, weekend_flag, passenger_count) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`);

  const today = new Date();
  let totalRecords = 0;

  for (let d = 30; d >= 0; d--) {
    const curDate = new Date(today);
    curDate.setDate(today.getDate() - d);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfWeek = curDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;

    stations.forEach(station => {
      // Simulate traffic for hours 6 to 22 (6 AM to 10 PM)
      for (let hour = 6; hour <= 22; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        
        // Base traffic
        let base = Math.floor(Math.random() * 200) + 50;
        
        // Peak hour multipliers (8-10 AM and 5-7 PM)
        if (hour >= 8 && hour <= 10) base *= 3;
        if (hour >= 17 && hour <= 19) base *= 3.5;
        
        // Station multipliers
        if (station.name === 'Aluva' || station.name === 'MG Road') base *= 1.5;
        
        // Weekend modifier (less peak traffic, more steady)
        if (isWeekend) {
          if (hour >= 8 && hour <= 10) base *= 0.5;
          if (hour >= 11 && hour <= 16) base *= 1.5; // Afternoon shopping
        }

        const passengerCount = Math.floor(base);

        insertPassenger.run(
          station.id, 
          dateStr, 
          timeSlot, 
          hour, 
          dayOfWeek, 
          isWeekend, 
          passengerCount
        );
        totalRecords++;
      }
    });
  }
  insertPassenger.finalize();
  
  console.log(`Successfully generated database with ${stations.length} stations and ${totalRecords} historical passenger records.`);
});

db.close();
