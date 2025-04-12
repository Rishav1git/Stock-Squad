// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [industries, setIndustries] = useState([]);

  // Fetch stock data based on search and industry filters.
  useEffect(() => {
    let url = 'http://localhost:3001/stocks';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (industry) params.append('industry', industry);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(err => console.error('Error fetching stocks:', err));
  }, [search, industry]);

  // Fetch unique list of industries from stock data.
  useEffect(() => {
    fetch('http://localhost:3001/stocks')
      .then(res => res.json())
      .then(data => {
        const uniqueIndustries = [...new Set(data.map(stock => stock.sector))];
        setIndustries(uniqueIndustries.filter(Boolean));
      });
  }, []);

  // When a user clicks the "View" button, navigate to StockDetails page.
  // Pass the company name via state so that StockDetails can search for details.
  const handleView = (stock) => {
    navigate('/stockdetails', { state: { companyName: stock.name } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Trending Stocks</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">All Industries</option>
          {industries.map((ind, idx) => (
            <option key={idx} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {stocks.map((stock) => (
          <div className={styles.card} key={stock.id}>
            <h2>
              {stock.name} <span className={styles.symbol}>({stock.symbol})</span>
            </h2>
            <p className={styles.price}>
              ₹{stock.latestPrice?.toFixed(2) || 'N/A'}
            </p>
            <button className={styles.button} onClick={() => handleView(stock)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
