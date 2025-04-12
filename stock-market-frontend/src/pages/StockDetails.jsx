// src/pages/StockDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StockDetails.module.css';

const dummyStocks = {
  AAPL: { name: 'Apple Inc.', price: 172.25, change: 1.32 },
  TSLA: { name: 'Tesla Inc.', price: 254.75, change: -2.12 },
  AMZN: { name: 'Amazon.com', price: 140.89, change: 0.87 },
  MSFT: { name: 'Microsoft', price: 310.21, change: -0.55 },
  NVDA: { name: 'NVIDIA', price: 450.10, change: 2.95 },
};

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const stock = dummyStocks[symbol.toUpperCase()];

  if (!stock) {
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

      <h1 className={styles.heading}>
        {stock.name} <span>({symbol.toUpperCase()})</span>
      </h1>

      <div className={styles.details}>
        <p className={styles.price}>Current Price: <strong>${stock.price.toFixed(2)}</strong></p>
        <p className={stock.change >= 0 ? styles.positive : styles.negative}>
          {stock.change >= 0 ? '+' : ''}{stock.change}% Today
        </p>
      </div>

      <div className={styles.chartPlaceholder}>
        📈 Chart Placeholder (Coming Soon)
      </div>
    </div>
  );
};

export default StockDetails;
