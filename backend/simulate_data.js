const mongoose = require('mongoose');
const { Station, PassengerData } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kmrl';

const stations = [
  { station_id: 1, station_name: 'Aluva', location: '10.1090, 76.3491', line: 'Blue' },
  { station_id: 2, station_name: 'Edapally', location: '10.0261, 76.3073', line: 'Blue' },
  { station_id: 3, station_name: 'MG Road', location: '9.9757, 76.2801', line: 'Blue' },
  { station_id: 4, station_name: 'Vyttila', location: '9.9674, 76.3193', line: 'Blue' },
  { station_id: 5, station_name: 'Kaloor', location: '9.9880, 76.2946', line: 'Blue' }
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // 1. Clear existing data
    console.log('Clearing existing collections...');
    await Station.deleteMany({});
    await PassengerData.deleteMany({});

    // 2. Insert Stations
    console.log('Seeding stations...');
    await Station.insertMany(stations);

    // 3. Simulate Passenger Data (Past 30 Days)
    console.log('Simulating 30 days of passenger history...');
    const today = new Date();
    const recordsToInsert = [];

    for (let d = 30; d >= 0; d--) {
      const curDate = new Date(today);
      curDate.setDate(today.getDate() - d);
      const dateStr = curDate.toISOString().split('T')[0];
      const dayOfWeek = curDate.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;

      for (const station of stations) {
        // Simulate traffic for hours 6 to 22 (6 AM to 10 PM)
        for (let hour = 6; hour <= 22; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
          
          let base = Math.floor(Math.random() * 200) + 50;
          
          // Peak multipliers
          if (hour >= 8 && hour <= 10) base *= 3;
          if (hour >= 17 && hour <= 19) base *= 3.5;
          if (station.station_name === 'Aluva' || station.station_name === 'MG Road') base *= 1.5;
          
          if (isWeekend) {
            if (hour >= 8 && hour <= 10) base *= 0.5;
            if (hour >= 11 && hour <= 16) base *= 1.5; 
          }

          recordsToInsert.push({
            station_id: station.station_id,
            date: dateStr,
            time_slot: timeSlot,
            hour,
            day_of_week: dayOfWeek,
            weekend_flag: isWeekend,
            passenger_count: Math.floor(base)
          });
        }
      }
    }

    // Batch insert for performance
    await PassengerData.insertMany(recordsToInsert);

    console.log(`Successfully generated database with ${stations.length} stations and ${recordsToInsert.length} historical passenger records.`);
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
