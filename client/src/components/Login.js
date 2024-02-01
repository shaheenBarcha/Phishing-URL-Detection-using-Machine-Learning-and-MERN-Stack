import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        email,
        password,
      };

      const response = await axios.post('http://localhost:4000/login', user);
      const message = response.data.message;

      if (message === 'Logged in as Admin') {
        setError('');
        window.location.href = '/admin'; // Redirect to offers page on successful login
      }
      else if (message === 'User Logged In') 
      {
        setError('');
        window.location.href = '/dashboard';
      }
      else 
      {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setError('Failed to login. Please try again later.');
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
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
          {error && <p className="error">{error}</p>}
          <a href="#" className="s" onClick={handleSubmit}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
