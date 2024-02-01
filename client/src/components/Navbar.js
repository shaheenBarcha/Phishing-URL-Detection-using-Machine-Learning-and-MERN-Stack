import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.post('http://localhost:4000/checkLogin');
        const { message } = response.data;

        if (message === 'User Logged In') {
          setIsLoggedIn(true);
        } else if (message === 'Admin Logged In') {
          setIsAdmin(true);
          setIsLoggedIn(true); // Set isLoggedIn to true when admin is logged in
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:4000/logout?logout=true');
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/login');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><a className="flash-button" href="/">Home</a></li>
        {!isLoggedIn && <li><a className="flash-button" href="/login">Login</a></li>}
        {!isLoggedIn && <li><a className="flash-button" href="/offers">Register</a></li>}
        {isLoggedIn && <li><a className="flash-button" href="/profile">My Profile</a></li>}
        {isLoggedIn && <li><a className="flash-button" href="/dashboard">Premium</a></li>} {/* Update the link to /premium */}
        {isAdmin && <li><a className="flash-button" href="/admin">Admin Panel</a></li>}
        <li><a className="flash-button" href="/contact">Contact Us</a></li>
        {!isLoggedIn && <li><a className="flash-button" href="/offers">Premium Features</a></li>} {/* New line for Premium Features */}
        {isLoggedIn && (
          <li className={`profile-dropdown ${showDropdown ? 'show' : ''}`}>
            <div className="profile-icon" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            {showDropdown && (
              <div className="dropdown-content">
                <a onClick={handleLogout}>Logout</a>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
