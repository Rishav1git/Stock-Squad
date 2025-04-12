import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StockDetails.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StockDetails = () => {
  const navigate = useNavigate();

  // Instead of using URL params, we keep track of the selected symbol in state.
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search bar input

  const handleAddToWatchlist = async () => {
    try {
      const res = await fetch('http://localhost:3001/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_id: stock.id }),
      });

      if (res.ok) {
        setMessage('⭐ Added to watchlist!');
      } else {
        const errData = await res.json();
        setMessage(`❌ ${errData.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add to watchlist.');
    }
  };

  // Function to handle search bar submission.
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setNotFound(false);
    setStock(null);
    setLoading(true);

    try {
      // Search for the stock by company name or symbol.
      const res = await fetch(`http://localhost:3001/stocks?search=${encodeURIComponent(searchTerm)}`);
      const results = await res.json();

      if (!results || results.length === 0) {
        setMessage("No matching stocks found.");
        setLoading(false);
        return;
      }
      // For simplicity, pick the first match.
      const match = results[0];
      setSelectedSymbol(match.symbol);

      // Now load the details for that stock.
      fetchStockDetails(match.id);
    } catch (err) {
      console.error(err);
      setMessage("Error searching for stock.");
      setLoading(false);
    }
  };

  // Fetch the detailed stock info given the stock id.
  const fetchStockDetails = (stockId) => {
    fetch(`http://localhost:3001/stocks/${stockId}`)
      .then((res) => res.json())
      .then((data) => {
        setStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stock details:', err);
        setNotFound(true);
        setLoading(false);
      });
  };

  // useEffect is not needed for initial load since we expect the user to start with a search.
  // But you can uncomment the below code if you want to load a default stock on mount.
  /*
  useEffect(() => {
    if (selectedSymbol) {
      // Fetch details for the selected symbol if available.
      // This requires that you determine the stock ID from your list.
    }
  }, [selectedSymbol]);
  */

  if (loading) return <div className={styles.container}>Loading...</div>;

  if (notFound) {
    return (
      <div className={styles.errorContainer}>
        <h2>Stock Not Found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search by company name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>Search</button>
      </form>

      {/* If stock details have been loaded, display them */}
      {stock && (
        <>
          <h1 className={styles.heading}>
            {stock.name} <span>({stock.symbol})</span>
          </h1>

          <div className={styles.details}>
            {/* Calculate today's change using the last two history entries */}
            {stock.history && stock.history.length > 1 && (() => {
              const latest = stock.history[stock.history.length - 1];
              const prev = stock.history[stock.history.length - 2];
              const change = ((latest.close - prev.close) / prev.close) * 100;
              return (
                <>
                  <p className={styles.price}>
                    Current Price: <strong>₹{latest.close.toFixed(2)}</strong>
                  </p>
                  <p className={change >= 0 ? styles.positive : styles.negative}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}% Today
                  </p>
                </>
              );
            })()}
          </div>

          <button className={styles.watchlistBtn} onClick={handleAddToWatchlist}>
            ⭐ Add to Watchlist
          </button>
          {message && <p className={styles.message}>{message}</p>}

          {stock.history && (
            <div className={styles.chart}>
              <h3>📈 Price History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stock.history.map(d => ({ date: d.date, price: d.close }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockDetails;
