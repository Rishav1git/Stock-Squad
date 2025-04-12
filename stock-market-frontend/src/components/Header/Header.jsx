// src/components/Header/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>StockSquad</div>

      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
        <NavLink to="/watchlist" className={({ isActive }) => isActive ? styles.active : ''}>Watchlist</NavLink>
      </nav>
    </header>
  );
};

export default Header;
