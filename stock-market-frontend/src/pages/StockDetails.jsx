import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StockDetails.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        // Fetch all stocks to find the ID by symbol
        const stockListRes = await fetch('http://localhost:3001/stocks');
        const stockList = await stockListRes.json();

        const found = stockList.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3001/stocks/${found.id}`);
        const data = await res.json();
        setStock(data);
      } catch (err) {
        console.error('Error fetching stock details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol]);

  if (loading) return <div className={styles.container}>Loading...</div>;

  if (notFound || !stock) {
    return (
      <div className={styles.errorContainer}>
        <h2>Stock Not Found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  // Get latest price and today's change
  const latest = stock.history[stock.history.length - 1];
  const prev = stock.history[stock.history.length - 2];
  const change = latest && prev ? ((latest.close - prev.close) / prev.close) * 100 : 0;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>

      <h1 className={styles.heading}>
        {stock.name} <span>({stock.symbol})</span>
      </h1>

      <div className={styles.details}>
        <p className={styles.price}>Current Price: <strong>₹{latest?.close.toFixed(2)}</strong></p>
        <p className={change >= 0 ? styles.positive : styles.negative}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% Today
        </p>
      </div>

      <button className={styles.watchlistBtn} onClick={handleAddToWatchlist}>⭐ Add to Watchlist</button>
      {message && <p className={styles.message}>{message}</p>}

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
    </div>
  );
};

export default StockDetails;
