// src/pages/Home.jsx
import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import TopGainers from '../components/Gainers/TopGainers'; 
import TopLosers from '../components/Losers/TopLosers';

const dummyStocks = [
 
];

const Home = () => {
  const navigate = useNavigate();

  const handleView = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Trending Stocks</h1>

      <div className={styles.grid}>
        {dummyStocks.map((stock) => (
          <div className={styles.card} key={stock.symbol}>
            <h2>{stock.name} <span className={styles.symbol}>({stock.symbol})</span></h2>
            <p className={styles.price}>${stock.price.toFixed(2)}</p>
            <p className={stock.change >= 0 ? styles.positive : styles.negative}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </p>
            <button className={styles.button} onClick={() => handleView(stock.symbol)}>
              View
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Top Gainers Section Added Below */}
      <TopGainers />
      <TopLosers />

    </div>
  );
};

export default Home;
