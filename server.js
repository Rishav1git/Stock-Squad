// server.js

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Open the SQLite database.
const dbPath = path.join(__dirname, 'db', 'stockdata.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    return console.error("Database connection error:", err.message);
  }
  console.log('Connected to the SQLite database.');
});

// GET /stocks: List all stocks with basic info and the latest closing price.
app.get('/stocks', (req, res) => {
  const query = `
    SELECT 
      s.id, 
      s.name, 
      s.symbol, 
      s.sector,
      (SELECT close FROM stock_history 
         WHERE stock_id = s.id 
         ORDER BY date DESC LIMIT 1) AS latestPrice
    FROM stocks s
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error retrieving stocks:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /stocks/:id: Get detailed info and historical data for one stock.
app.get('/stocks/:id', (req, res) => {
  const stockId = req.params.id;

  // Get stock metadata.
  db.get('SELECT * FROM stocks WHERE id = ?', [stockId], (err, stock) => {
    if (err) {
      console.error("Error retrieving stock:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    // Get historical data for the stock.
    db.all(
      'SELECT * FROM stock_history WHERE stock_id = ? ORDER BY date ASC',
      [stockId],
      (err, history) => {
        if (err) {
          console.error("Error retrieving stock history:", err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({
          stock,
          history
        });
      }
    );
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
