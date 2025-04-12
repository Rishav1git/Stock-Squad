import React from 'react';

function PortfolioItem({ stock }) {
  return (
    <tr>
      <td>{stock.name}</td>
      <td>₹{stock.currentValue}</td>
      <td>₹{stock.price}</td>
      <td>{stock.quantity}</td>
    </tr>
  );
}

export default PortfolioItem;
