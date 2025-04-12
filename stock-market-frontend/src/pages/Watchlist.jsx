import React, { useEffect, useState } from 'react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('http://localhost:3001/watchlist');
      const text = await res.text(); // Get raw response text
      console.log("Raw API response:", text);

      const data = JSON.parse(text); // Try parsing to JSON
      setWatchlist(data);
      localStorage.setItem('watchlist', JSON.stringify(data)); // Cache
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
    <div className="container mt-4">
      <h2 className="mb-4">📈 Your Watchlist</h2>

      {loading && <p>Loading your watchlist...</p>}
      {error && <div className="alert alert-warning">{error}</div>}

      {!loading && watchlist.length === 0 && (
        <p>No stocks in your watchlist.</p>
      )}

      {!loading && watchlist.length > 0 && (
        <div className="row">
          {watchlist.map((stock, index) => (
            <div key={`${stock.watchlist_id}-${index}`} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {stock.name} ({stock.symbol})
                  </h5>
                  <p className="card-text">
                    <strong>Sector:</strong> {stock.sector}<br />
                    <strong>Latest Price:</strong>{' '}
                    ₹{stock.latestPrice ? stock.latestPrice.toFixed(2) : 'N/A'}
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(stock.watchlist_id)}
                  >
                    Remove from Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
