const mongoose = require('mongoose');
const { PassengerData } = require('./models');
const { RandomForestRegression } = require('ml-random-forest');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metro_ai';

async function trainModel() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Loading dataset from MongoDB...");

    const rows = await PassengerData.find({}, 'station_id hour day_of_week weekend_flag passenger_count');

    if (rows.length === 0) {
      console.warn("No passenger data found in MongoDB. Please run simulate_data.js first.");
      process.exit(1);
    }

    const X = [];
    const y = [];

    rows.forEach(row => {
      X.push([row.station_id, row.hour, row.day_of_week, row.weekend_flag]);
      y.push(row.passenger_count);
    });

    console.log(`Training Random Forest Model on ${X.length} records... This may take a moment.`);
    
    const options = {
      seed: 42,
      maxFeatures: 2,
      replacement: false,
      nEstimators: 50
    };

    const regression = new RandomForestRegression(options);
    regression.train(X, y);

    console.log("Model trained successfully.");

    const modelJSON = regression.toJSON();
    fs.writeFileSync(path.resolve(__dirname, 'demand_model.json'), JSON.stringify(modelJSON));
    
    console.log("AI Model exported to demand_model.json.");
    process.exit(0);

  } catch (error) {
    console.error("Error training model:", error);
    process.exit(1);
  }
}

trainModel();
