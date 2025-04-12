import React, { useEffect, useState } from 'react';
import styles from './Watchlist.module.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('http://localhost:3001/watchlist');
      const text = await res.text();
      console.log("Raw API response:", text);

      const data = JSON.parse(text);
      setWatchlist(data);
      localStorage.setItem('watchlist', JSON.stringify(data));
      setError(null);
    } catch (err) {
      console.warn('API fetch failed, trying localStorage...', err.message);
      setError('Failed to fetch from API. Loaded from local storage.');

      const cached = localStorage.getItem('watchlist');
      if (cached) {
        setWatchlist(JSON.parse(cached));
      } else {
        setWatchlist([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (watchlist_id) => {
    try {
      const res = await fetch(`http://localhost:3001/watchlist/${watchlist_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete from watchlist');
      }

      const updatedWatchlist = watchlist.filter(stock => stock.watchlist_id !== watchlist_id);
      setWatchlist(updatedWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
      setError('Failed to delete from watchlist');
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📈 Your Watchlist</h2>

      {loading && <p className={styles.loading}>Loading your watchlist...</p>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && watchlist.length === 0 && (
        <p className={styles.noItems}>No stocks in your watchlist.</p>
      )}

      {!loading && watchlist.length > 0 && (
        <div className={styles.grid}>
          {watchlist.map((stock, index) => (
            <div key={`${stock.watchlist_id}-${index}`} className={styles.card}>
              <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>
                  {stock.name} <span className={styles.symbol}>({stock.symbol})</span>
                </h5>
                <p className={styles.cardText}>
                  <strong>Sector:</strong> {stock.sector}<br />
                  <strong>Latest Price:</strong> ₹{stock.latestPrice ? stock.latestPrice.toFixed(2) : 'N/A'}
                </p>
                <button
                  className={styles.button}
                  onClick={() => handleDelete(stock.watchlist_id)}
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
