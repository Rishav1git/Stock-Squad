// src/pages/StockDetails.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './StockDetails.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StockDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCompanyName = location.state?.companyName || '';

  const [searchTerm, setSearchTerm] = useState(initialCompanyName);
  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setNotFound(false);
    setStock(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/stocks?search=${encodeURIComponent(searchTerm)}`);
      const results = await res.json();

      if (!results?.length) {
        setMessage('No matching stocks found.');
        setLoading(false);
        return;
      }

      fetchStockDetails(results[0].id);
    } catch (err) {
      console.error(err);
      setMessage('Error searching for stock.');
      setLoading(false);
    }
  };

  const fetchStockDetails = async (stockId) => {
    try {
      const res = await fetch(`http://localhost:3001/stocks/${stockId}`);
      const data = await res.json();
      setStock(data);
    } catch (err) {
      console.error('Error fetching stock details:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const res = await fetch('http://localhost:3001/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_id: stock.id }),
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        setMessage(`❌ ${data.error || 'Failed to add to watchlist.'}`);
        return;
      }

      setMessage('⭐ Added to watchlist!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add to watchlist.');
    }
  };

  useEffect(() => {
    if (initialCompanyName) {
      handleSearchSubmit({ preventDefault: () => {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCompanyName]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (notFound) {
    return (
      <div className={styles.errorContainer}>
        <h2>Stock Not Found</h2>
        <button className={styles.backBtn} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search by company name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>

      {/* Display messages */}
      {message && <p className={styles.message}>{message}</p>}

      {/* Stock Info */}
      {stock && (
        <>
          <h1 className={styles.heading}>
            {stock.name} <span>({stock.symbol})</span>
          </h1>

          <div className={styles.details}>
            {stock.history?.length > 1 && (() => {
              const latest = stock.history.at(-1);
              const previous = stock.history.at(-2);
              const change = ((latest.close - previous.close) / previous.close) * 100;

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

          {/* Chart */}
          {stock.history?.length > 0 && (
            <div className={styles.chart}>
              <h3>📈 Price History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stock.history.map(({ date, close }) => ({ date, price: close }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={false}
                  />
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
