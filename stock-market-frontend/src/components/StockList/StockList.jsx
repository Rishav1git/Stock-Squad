// src/components/StockList/StockList.jsx
import React, { useState, useEffect } from 'react';
import styles from './StockList.module.css';
import { useNavigate } from 'react-router-dom';

const dummyStocks = [
  
];

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const navigate = useNavigate();

  // Simulate fetching data from /stocks endpoint on component mount
  useEffect(() => {
    // Simulate delay (you could use fetch('/stocks') in a real scenario)
    setTimeout(() => {
      setStocks(dummyStocks);
    }, 500);
  }, []);

  // Filter stocks based on search input and selected industry
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || stock.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // List of unique industries for dropdown
  const industries = ['All', ...Array.from(new Set(dummyStocks.map(stock => stock.industry)))];

  const handleView = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Stock List</h2>
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by name or symbol"
          className={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.dropdown}
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
        >
          {industries.map(ind => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {filteredStocks.map(stock => (
          <div key={stock.symbol} className={styles.card}>
            <h3 className={styles.stockName}>
              {stock.name} <span className={styles.symbol}>({stock.symbol})</span>
            </h3>
            <p className={styles.price}>₹ {stock.price}</p>
            <p className={styles.industry}>{stock.industry}</p>
            <button className={styles.button} onClick={() => handleView(stock.symbol)}>
              View Details
            </button>
          </div>
        ))}
        {filteredStocks.length === 0 && (
          <p className={styles.noResult}>No stocks found.</p>
        )}
      </div>
    </div>
  );
};

export default StockList;
