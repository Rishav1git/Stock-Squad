import React from 'react'
import Portfolioitems from './Portfolioitems';

export default function Portfolio() {
    const Portfolio = [
        { id: 1, name: 'Tata Motors', currentValue: 600 , price : 891 , quantity : 100 },
        { id: 2, name: 'Cipla', currentValue: 312 , price : 230 , quantity : 190},
        { id: 3, name: 'Sun Pharma', currentValue: 422 , price :450 , quantity : 50 }
      ];
      const totalInvestment = Portfolio.reduce((sum, stock) => sum + (stock.price*stock.quantity), 0);
      const totalCurrentValue = Portfolio.reduce((sum, stock) => sum + (stock.currentValue*stock.quantity), 0);
  return (
    <>
    <div class="card ">
  <div class="card-header">
    <h3>Your Portfolio </h3>
  </div>

  <div class="card-body danger ">
  <div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Total Investment </h5>
        <p class="card-text"> INR {totalInvestment}</p>
        <a href="#" class="btn btn-primary">Show Break Down</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class={`card-title`}>Current Value</h5>
        <p class="card-text">INR {totalCurrentValue}</p>
        <a href="#" class="btn btn-primary">Show Break Down</a>
      </div>
    </div>
  </div>
</div>
  </div>
  <div class="card-footer text-muted">
  <div className="container mt-4">
      <h2 className="mb-4">My Portfolio</h2>
      <table className="table table-bordered table-striped table-light">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Current Value (₹)</th>
            <th>Buy Price (₹)</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Portfolio.map(stock => (
            <Portfolioitems key={stock.id} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
    
    </>

     
  )
}
