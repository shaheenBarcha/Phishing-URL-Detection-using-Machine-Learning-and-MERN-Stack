import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css'; // Import CSS file

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and message
    if (!email || !message) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/contact', { email, message });
      console.log(response.data); // Handle successful message submission
      const BEmsg = response.data.message;
      if ({message:'Message saved on DB'})
      {
        window.alert('Message Sent Successfully')
        window.location.href = '/'
        
      }
    } catch (error) {
      console.error(error.response.data); // Handle message submission error
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-content">
        <h2 className="contact-us-title">Contact Us</h2>
        <div className="contact-box" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message:</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
            />
          </div>

          <a href="#" className="s" onClick={handleSubmit}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
