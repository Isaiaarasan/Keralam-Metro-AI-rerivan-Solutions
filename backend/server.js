const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Station, PassengerData } = require('./models');
const path = require('path');
const fs = require('fs');
const { RandomForestRegression } = require('ml-random-forest');
const { optimizeSchedule } = require('./scheduler');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kmrl';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for API Routes'))
  .catch(err => console.error('MongoDB connection error:', err));

// Load the AI Model
let demandModel;
const modelPath = path.resolve(__dirname, 'demand_model.json');
if (fs.existsSync(modelPath)) {
  const modelJSON = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  demandModel = RandomForestRegression.load(modelJSON);
  console.log("AI Demand Model loaded from disk.");
} else {
  console.error("AI Demand Model not found! Please run train_ai.js first.");
}

// GET /stations
app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find({});
    // Map _id to id or just return them (Mongoose returns _id by default, but also our station_id field)
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /passenger-data
app.get('/passenger-data', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const data = await PassengerData.find({}).sort({ date: -1, hour: -1 }).limit(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /predict-demand
app.post('/predict-demand', (req, res) => {
  const { station_id, hour, day_of_week, weekend_flag } = req.body;
  
  if (!demandModel) return res.status(500).json({ error: "AI Model not loaded." });
  
  const predictions = demandModel.predict([[station_id, hour, day_of_week, weekend_flag]]);
  const predictedValue = Math.max(0, Math.round(predictions[0])); 
  
  res.json({
    station_id,
    hour,
    predicted_passengers: predictedValue
  });
});

// Utility POST for batch predictions for the dashboard charts
app.post('/predict-demand-batch', (req, res) => {
  const { requests } = req.body; 
  
  if (!demandModel) return res.status(500).json({ error: "AI Model not loaded." });

  const X = requests.map(r => [r.station_id, r.hour, r.day_of_week, r.weekend_flag]);
  const predictions = demandModel.predict(X);

  const results = requests.map((r, i) => ({
    ...r,
    predicted_passengers: Math.max(0, Math.round(predictions[i]))
  }));

  res.json(results);
});

// GET /schedule
app.get('/schedule', (req, res) => {
  const predicted_passengers = parseInt(req.query.predicted_passengers);
  if (isNaN(predicted_passengers)) {
    return res.status(400).json({ error: "Please provide ?predicted_passengers="});
  }

  const schedulePlan = optimizeSchedule(predicted_passengers);
  res.json(schedulePlan);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`KMRL Backend API running on http://localhost:${PORT}`);
});
