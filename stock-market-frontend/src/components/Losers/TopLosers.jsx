// src/components/Losers/TopLosers.jsx
import React from 'react';
import styles from './TopLosers.module.css';
import { useNavigate } from 'react-router-dom';

const losers = [
  { name: 'Zomato Ltd', symbol: 'ZOMATO', price: 112.75, change: -4.52 },
  { name: 'Paytm', symbol: 'PAYTM', price: 437.10, change: -3.78 },
  { name: 'Nykaa', symbol: 'NYKAA', price: 123.65, change: -2.14 },
  { name: 'IRCTC', symbol: 'IRCTC', price: 647.30, change: -1.85 },
  { name: 'Adani Power', symbol: 'ADANIPOWER', price: 312.50, change: -1.72 },
];

const TopLosers = () => {
  const navigate = useNavigate();

  const handleView = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Top Losers</h2>
      <div className={styles.grid}>
        {losers.map((stock) => (
          <div className={styles.card} key={stock.symbol}>
            <h3>{stock.name} <span className={styles.symbol}>({stock.symbol})</span></h3>
            <p className={styles.price}>₹{stock.price.toFixed(2)}</p>
            <p className={styles.negative}>
              {stock.change}%
            </p>
            <button className={styles.button} onClick={() => handleView(stock.symbol)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLosers;
