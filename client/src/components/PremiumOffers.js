import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PremiumOffers.css';
import { useNavigate } from 'react-router-dom';


function PremiumOffers() {

  const navigate = useNavigate();
  const handleSubscription = async (Selectedplan) => {
    try {
      // Make a POST request to the backend API to subscribe the user to the selected plan
      const response = await axios.post('http://localhost:4000/getPlan', { Selectedplan });
      console.log(response.data); // Assuming the backend API returns a response indicating the subscription status
    
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    }
  };
  return (
    <div className="premium-page">
      <main>
        <section className='pricing-box'>
          <div className="pricing-card">
            <h2>Basic</h2>
            <div className="price">$9.99/month</div>
            <ul>
              <li>Unlimited Scans</li>
              <li>IP Address of URL</li>
              <li>City of Server</li>
              <li>Region</li>
            </ul>
            {/* Use anchor tag with onClick to subscribe */}
            <a onClick={() => handleSubscription('Basic')} href="/dummy-payment-page" className="premium">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Subscribe Now
            </a>
          </div>

          <div className="pricing-card">
            <h2>Standard</h2>
            <div className="price">$19.99/month</div>
            <ul>
              <li>Unlimited Scans</li>
              <li>IP Address of URL</li>
              <li>City of Server</li>
              <li>Region</li>
              <li>Register Date and Registerer</li>
              <li>Update Date</li>
              <li>Expiry Date</li>
            </ul>
            {/* Use anchor tag with onClick to subscribe */}
            <a onClick={() => handleSubscription('Standard')} href="/dummy-payment-page" className="premium">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Subscribe Now
            </a>
          </div>

          <div className="pricing-card">
            <h2>Premium</h2>
            <div className="price">$29.99/month</div>
            <ul>
              <li>All Basic features</li>
              <li>All Standard Features</li>
              <li>Alexa Rank</li>
              <li>Webtraffic</li>
              <li>Complete Statistics</li>
              <li>Snapshot of any URL</li>
            </ul>
            {/* Use anchor tag with onClick to subscribe */}
            <a onClick={() => handleSubscription('Premium')} href="/dummy-payment-page" className="premium">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Subscribe Now
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PremiumOffers;