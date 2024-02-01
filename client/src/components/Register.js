import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      username &&
      password &&
      password === confirmPassword &&
      email &&
      phoneNumber
    ) {
      setError('');

      try {
        const user = {
          username,
          password,
          email,
          phoneNumber,
        };
        await axios.post('http://localhost:4000/register', user);

        console.log('User registered successfully!');
        window.alert('User Added Successfully')
        window.location.href = '/login';

    
      } 
      catch (error) 
      {
        console.error('An error occurred during user registration:', error);
        setError('Failed to register. Please try again later.');
      }
    } else {
      setError('Please fill in all fields correctly');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>
          <div className="user-box">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label>Phone Number</label>
          </div>
          {error && <p className="error">{error}</p>}
          <a href="#" className="register-button" onClick={handleSubmit}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Register
          </a>
        </form>
      </div>
    </div>
  );
};

export default Register;
