// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import StockDetails from './pages/StockDetails';
import Layout from './components/Layout/Layout';
import Porfolio from './components/Porfolio/Porfolio';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/stock/:symbol" element={<StockDetails />} />
          <Route path="/portfolio" element={<Porfolio/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
