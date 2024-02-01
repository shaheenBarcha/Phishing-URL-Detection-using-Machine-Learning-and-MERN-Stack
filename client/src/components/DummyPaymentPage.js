import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DummyPaymentPage.css'; // Import CSS file

const DummyPaymentPage = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  const [cardNumber, setCardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cvv, setCVV] = useState('');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation here
    if (!cardNumber || !email || !cvv || !expiry) {
      setError('Please fill in all fields');
      return;
    }

    // Clear any previous error
    setError('');

    try {
      // Call your API endpoint with the email
      const response = await axios.post('http://localhost:4000/check-email', { email });

      // Check the response from the API
      const data = response.data;
      if (data === 'email found') {
        // Navigate to the login page
        navigate('/login');
      } else if (data === 'not registered') {
        // Navigate to the register page
        navigate('/register');
      } else {
        setError('Unexpected response from the server');
      }
    } catch (error) {
      setError('Error connecting to the server');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Make a Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              name="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <label>Card Number</label>
          </div>
          <div className="input-box">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="cvv"
              value={cvv}
              onChange={(e) => setCVV(e.target.value)}
              required
            />
            <label>CVV</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
            <label>Expiry Date</label>
          </div>
          {error && <p className="error">{error}</p>}

          <a href="#" className="s" onClick={handleSubmit}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Make a Payment
          </a>
        </form>
      </div>
    </div>
  );
};

export default DummyPaymentPage;
