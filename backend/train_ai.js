const sqlite3 = require('sqlite3').verbose();
const { RandomForestRegression } = require('ml-random-forest');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("Loading dataset from SQLite...");

db.all(`SELECT station_id, hour, day_of_week, weekend_flag, passenger_count FROM passenger_data`, [], (err, rows) => {
  if (err) throw err;

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
  db.close();
});
