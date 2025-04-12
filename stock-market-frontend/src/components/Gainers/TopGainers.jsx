import React from 'react';
import styles from './TopGainers.module.css';

const topGainers = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 983.5, change: '+2.15%' },
  { symbol: 'ADANIENT', name: 'Adani Ent.', price: 2340.0, change: '+1.80%' },
  { symbol: 'ONGC', name: 'ONGC Ltd', price: 243.6, change: '+1.55%' },
  { symbol: 'POWERGRID', name: 'Power Grid', price: 276.9, change: '+1.48%' },
];

const TopGainers = () => {
  return (
    <div className={styles.gainersWrapper}>
      <h2 className={styles.heading}>📈 Top Gainers (NSE)</h2>
      <div className={styles.cardsWrapper}>
        {topGainers.map((stock) => (
          <div key={stock.symbol} className={styles.card}>
            <div className={styles.symbol}>{stock.symbol}</div>
            <div className={styles.name}>{stock.name}</div>
            <div className={styles.price}>₹ {stock.price}</div>
            <div className={styles.change}>{stock.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopGainers;
