import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Premium_offers from './components/PremiumOffers';
import DummyPaymentPage from './components/DummyPaymentPage';
import AdminPanel from './components/AdminPanel';
import ContactUs from './components/ContactUs';
import './components/common.css';
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="slide-container">
          {/* <Slide /> Add the Slide component */}
        </div>
        <div className="content-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/offers" element={<Premium_offers  />} />
            <Route path="/dummy-payment-page" element={<DummyPaymentPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
