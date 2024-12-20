import React, { useState } from 'react';
import './App.css'; // You can customize the CSS here
import axios from 'axios';

function App() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const createBidder = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/create-bidder');
      // setOrderId(response.data.orderId);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };
  const receiveOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5001/create-order');
      // setOrderId(response.data.orderId);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
    }
  };
  const getOrder = async () => {
      const response = await axios.get('http://localhost:5001/get-order');
  };

  return (
    <div className="App">
      <div>
      <div className="button-container">
        <button onClick={getOrder} disabled={loading}>
          {'Log Orders'}
        </button>
      </div>
      <div className="button-container">
        <button onClick={createBidder} disabled={loading}>
          {'Bidder comes online'}
        </button>
      </div>
      <div className="button-container">
        <button onClick={receiveOrder} disabled={loading}>
          {'Receive Order'}
        </button>
      </div>
      </div>
      {/* {orderId && <p>Order ID: {orderId}</p>} */}
    </div>
  );
}

export default App;
