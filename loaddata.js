// loadData.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database (stored in ./db/stockdata.db)
const dbPath = path.join(__dirname, 'db', 'stockdata.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist.
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      sector TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stock_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_id INTEGER,
      date TEXT,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      ltp REAL,
      volume INTEGER,
      FOREIGN KEY(stock_id) REFERENCES stocks(id)
    )
  `);
});

const DATA_DIR = path.join(__dirname, 'data');

// Recursively get all CSV files in the directory.
function getAllCSVFiles(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllCSVFiles(fullPath));
    } else if (fullPath.endsWith('.csv')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Process a single CSV file: read data, insert stock metadata, then insert stock history.
async function processFile(file) {
  const rows = [];
  // Use the CSV filename (without the extension) as the stock name and symbol.
  const fileName = path.basename(file, '.csv');
  // Assume the parent folder's name represents the sector.
  const sector = path.basename(path.dirname(file));
  const stockName = fileName;

  // Read CSV file and trim headers.
  await new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim() // Remove extra spaces from header names
      }))
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        if (rows.length === 0) {
          console.warn(`No data found in file: ${file}`);
        }
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error reading file ${file}:`, err);
        reject(err);
      });
  });

  // Skip file if no rows are loaded.
  if (rows.length === 0) return;

  // Insert stock metadata into the stocks table and retrieve the new stock ID.
  const stockId = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO stocks (name, symbol, sector) VALUES (?, ?, ?)`,
      [stockName, fileName, sector],
      function (err) {
        if (err) {
          console.error(`Error inserting into stocks for file ${file}:`, err.message);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });

  // Insert each historical row into the stock_history table.
  await new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO stock_history (stock_id, date, open, high, low, close, ltp, volume)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const row of rows) {
      stmt.run(
        stockId,
        row.Date, // Header "Date" after trimming
        parseFloat(row.OPEN?.replace(/,/g, '') || 0),
        parseFloat(row.HIGH?.replace(/,/g, '') || 0),
        parseFloat(row.LOW?.replace(/,/g, '') || 0),
        parseFloat(row.close?.replace(/,/g, '') || 0),
        parseFloat(row.ltp?.replace(/,/g, '') || 0),
        parseInt(row.VOLUME?.replace(/,/g, '') || 0)
      );
    }
    stmt.finalize(err => {
      if (err) {
        console.error("Error finalizing statement:", err);
        return reject(err);
      }
      resolve();
    });
  });
}

// Load all CSV files and process them one by one.
async function loadStockData() {
  const files = getAllCSVFiles(DATA_DIR);
  console.log(`Found ${files.length} CSV files.`);

  // Process each file sequentially to avoid overwhelming the database.
  for (const file of files) {
    try {
      await processFile(file);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
      // Optionally, decide here if you want to continue or break.
    }
  }
}

loadStockData()
  .then(() => {
    console.log('✅ All stock data loaded!');
    db.close();
    process.exit();
  })
  .catch(err => {
    console.error("Error loading stock data:", err);
    process.exit(1);
  });
