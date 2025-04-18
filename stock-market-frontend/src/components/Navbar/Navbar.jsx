import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>📈 StockSquad</div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink></li>
        <li>   <NavLink to="/watchlist" activeClassName="active">Watchlist</NavLink></li>
        <li><NavLink to="/stockdetails" activeClassName="active">StockDetails</NavLink></li>

      </ul>
    </nav>
  );
};

export default Navbar;
