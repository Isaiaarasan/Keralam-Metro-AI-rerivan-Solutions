const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { RandomForestRegression } = require('ml-random-forest');
const { optimizeSchedule } = require('./scheduler');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

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
app.get('/stations', (req, res) => {
  db.all('SELECT * FROM stations', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /passenger-data
app.get('/passenger-data', (req, res) => {
  const limit = req.query.limit || 100;
  db.all('SELECT * FROM passenger_data ORDER BY date DESC, hour DESC LIMIT ?', [limit], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /predict-demand
// We use GET instead of POST for easier fetching, allowing ?station_id=1&hour=8 etc, or we can use POST as intended.
// POST /predict-demand payload: { station_id, hour, day_of_week, weekend_flag }
app.post('/predict-demand', (req, res) => {
  const { station_id, hour, day_of_week, weekend_flag } = req.body;
  
  if (!demandModel) return res.status(500).json({ error: "AI Model not loaded." });
  
  const predictions = demandModel.predict([[station_id, hour, day_of_week, weekend_flag]]);
  const predictedValue = Math.max(0, Math.round(predictions[0])); // Can't be negative passenger count
  
  res.json({
    station_id,
    hour,
    predicted_passengers: predictedValue
  });
});

// Utility POST for batch predictions for the dashboard charts
app.post('/predict-demand-batch', (req, res) => {
  const { requests } = req.body; // array of { station_id, hour, day_of_week, weekend_flag }
  
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
// Example Query: ?predicted_passengers=850
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
