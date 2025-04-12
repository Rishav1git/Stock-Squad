// server.js

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
app.use(cors());

const app = express();
const PORT = process.env.PORT || 3001;

// Open the SQLite database.
const dbPath = path.join(__dirname, 'db', 'stockdata.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    return console.error("Database connection error:", err.message);
  }
  console.log('Connected to the SQLite database.');
});

// GET /stocks: List all stocks with basic info and the latest closing price.
// GET /stocks?search=...&industry=...
app.get('/stocks', (req, res) => {
  const { search, industry } = req.query;

  let query = `
    SELECT 
      s.id, 
      s.name, 
      s.symbol, 
      s.sector,
      (SELECT close FROM stock_history 
         WHERE stock_id = s.id 
         ORDER BY date DESC LIMIT 1) AS latestPrice
    FROM stocks s
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (s.name LIKE ? OR s.symbol LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term);
  }

  if (industry) {
    query += ` AND s.sector = ?`;
    params.push(industry);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error retrieving stocks:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /stocks/:id: Get detailed info and historical data for one stock.
// GET /stocks/:id - Detailed info and formatted history
app.get('/stocks/:id', (req, res) => {
  const stockId = req.params.id;

  db.get('SELECT * FROM stocks WHERE id = ?', [stockId], (err, stock) => {
    if (err) {
      console.error("Error retrieving stock:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    db.all(
      `SELECT date, open, high, low, close, ltp, volume
       FROM stock_history 
       WHERE stock_id = ? 
       ORDER BY date ASC`,
      [stockId],
      (err, history) => {
        if (err) {
          console.error("Error retrieving history:", err.message);
          return res.status(500).json({ error: err.message });
        }

        // Format for chart use
        const formattedHistory = history.map(row => ({
          date: row.date,
          open: row.open,
          high: row.high,
          low: row.low,
          close: row.close,
          ltp: row.ltp,
          volume: row.volume
        }));

        res.json({
          ...stock,
          history: formattedHistory
        });
      }
    );
  });
});

// GET /watchlist - Get all saved stocks
app.get('/watchlist', (req, res) => {
  const query = `
    SELECT 
      w.id as watchlist_id,
      s.id, s.name, s.symbol, s.sector,
      (SELECT close FROM stock_history 
         WHERE stock_id = s.id 
         ORDER BY date DESC LIMIT 1) AS latestPrice
    FROM watchlist w
    JOIN stocks s ON w.stock_id = s.id
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching watchlist:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /watchlist - Add stock to watchlist
app.post('/watchlist', express.json(), (req, res) => {
  const { stock_id } = req.body;
  if (!stock_id) {
    return res.status(400).json({ error: "stock_id is required" });
  }

  db.run(
    `INSERT INTO watchlist (stock_id) VALUES (?)`,
    [stock_id],
    function (err) {
      if (err) {
        console.error("Error adding to watchlist:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Added to watchlist", id: this.lastID });
    }
  );
});

// DELETE /watchlist/:id - Remove from watchlist
app.delete('/watchlist/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM watchlist WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error("Error removing from watchlist:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Item not found in watchlist" });
    }
    res.json({ message: "Removed from watchlist" });
  });
});


// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
