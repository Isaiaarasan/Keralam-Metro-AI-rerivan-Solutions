const mongoose = require('mongoose');

// Define Station Schema
const StationSchema = new mongoose.Schema({
  station_id: { type: Number, required: true, unique: true },
  station_name: { type: String, required: true },
  location: { type: String, required: true },
  line: { type: String, required: true }
});

// Define Passenger Data Schema
const PassengerDataSchema = new mongoose.Schema({
  station_id: { type: Number, required: true, ref: 'Station' },
  date: { type: String, required: true },
  time_slot: { type: String, required: true },
  hour: { type: Number, required: true },
  day_of_week: { type: Number, required: true },
  weekend_flag: { type: Number, required: true },
  passenger_count: { type: Number, required: true }
});

// Define Prediction Schema
const PredictionSchema = new mongoose.Schema({
  station_id: { type: Number, required: true, ref: 'Station' },
  time_slot: { type: String, required: true },
  predicted_passengers: { type: Number, required: true }
});

// Compile Models
const Station = mongoose.model('Station', StationSchema);
const PassengerData = mongoose.model('PassengerData', PassengerDataSchema);
const Prediction = mongoose.model('Prediction', PredictionSchema);

module.exports = {
  Station,
  PassengerData,
  Prediction
};
