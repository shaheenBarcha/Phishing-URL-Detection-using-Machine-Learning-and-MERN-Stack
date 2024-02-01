import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [geolocationData, setGeolocationData] = useState(null);
  const [pythonData, setPythonData] = useState(null);
  const [alexaRank, setAlexaRank] = useState('');
  const [userPlan, setUserPlan] = useState('');
  const [statisticsAlert, setStatisticsAlert] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [isLoadingScrape, setIsLoadingScrape] = useState(false);
  const [isLoadingAlexaRank, setIsLoadingAlexaRank] = useState(false);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [isLoadingScan, setIsLoadingScan] = useState(false);

  useEffect(() => {
    // Call the Flask API to get the user's plan
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await axios.get('http://localhost:4000/userPlan');
      setUserPlan(response.data.plan);
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const handleGeolocation = async () => {
    setIsLoadingGeolocation(true);
    try {
      const response = await axios.post('http://localhost:5100/geolocation', {
        url: url,
      });
      setGeolocationData(response.data);
    } catch (error) {
      console.error('Error during geolocation:', error);
    } finally {
      setIsLoadingGeolocation(false);
    }
  };

  const handleScrape = async () => {
    setIsLoadingScrape(true);
    try {
      const response = await axios.post('http://localhost:5100/get_whois_results', {
        url: url,
      });
      setPythonData(response.data);
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      setIsLoadingScrape(false);
    }
  };

  const getAlexaRank = async () => {
    setIsLoadingAlexaRank(true);
    try {
      const response = await axios.post('http://localhost:5100/alexa_rank', {
        url: url,
      });
      setAlexaRank(response.data.rank);
    } catch (error) {
      console.error('Error getting Alexa rank:', error);
    } finally {
      setIsLoadingAlexaRank(false);
    }
  };

  const handleGetStatistics = async () => {
    setIsLoadingStatistics(true);
    try {
      const response = await axios.post('http://localhost:5100/get_statistics', {
        url: url,
      });
      if (response.data.success) {
        setStatisticsAlert(true);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoadingStatistics(false);
    }
  };

  const handleScanWebsite = async () => {
    setIsLoadingScan(true);
    try {
      const response = await axios.post('http://localhost:5100/scan_website', {
        url: scanUrl,
      });
      if (response.data.success) {
        setScanResult('Scan Successful');
        setTimeout(() => setScanResult(null), 3000);
      } else {
        setScanResult('Scan Failed');
      }
    } catch (error) {
      console.error('Error during website scanning:', error);
      setScanResult('Scan Failed');
    } finally {
      setIsLoadingScan(false);
    }
  };

  return (
    <div className="premium-page">
      <main>
        <section className="pricing-box">
          {/* Box 1 */}
          <div className="pricing-card">
            <h2>Basic</h2>
            <div className="result-container">
              <p>IP: {geolocationData?.IP}</p>
              <p>City: {geolocationData?.City}</p>
              <p>Region: {geolocationData?.Region}</p>
              <p>Country: {geolocationData?.Country}</p>
              <div className="input-box">
                <input type="text" id="url-input" value={url} onChange={(e) => setUrl(e.target.value)} required />
                <label htmlFor="url-input">Enter URL</label>
              </div>
            </div>
            <a href="#" id="predict-btn" onClick={handleGeolocation}>
              {isLoadingGeolocation ? (
                <div className="loading-icon">
                  <div className="spinner"></div>
                </div>
              ) : (
                <React.Fragment>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Submit
                </React.Fragment>
              )}
            </a>
          </div>

          {/* Box 2 */}
          {(userPlan === 'Standard' || userPlan === 'Premium') && (
            <div className="pricing-card">
              <h2>Standard</h2>
              <div className="result-container">
                <p>Registrar: {pythonData?.Registrar}</p>
                <p>Expires On: {pythonData?.['Expires On']}</p>
                <p>Updated On: {pythonData?.['Updated On']}</p>
                <p>Registered On: {pythonData?.['Registered On']}</p>
              </div>
              <a href="#" onClick={handleScrape}>
                {isLoadingScrape ? (
                  <div className="loading-icon">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <React.Fragment>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                  </React.Fragment>
                )}
              </a>
            </div>
          )}

          {/* Box 3 */}
          {userPlan === 'Premium' && (
            <div className="pricing-card">
              <h2>Premium</h2>
              <div className="result-container">
                <p>Alexa Rank: {alexaRank ? alexaRank : 'Not Available'}</p>
              </div>
              <div className="statistics-button">
                <a href="#" onClick={getAlexaRank}>
                  {isLoadingAlexaRank ? (
                    <div className="loading-icon">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <React.Fragment>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      Get Alexa Rank
                    </React.Fragment>
                  )}
                </a>
              </div>
              <div className="statistics-button">
                <a href="#" onClick={handleGetStatistics}>
                  {isLoadingStatistics ? (
                    <div className="loading-icon">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <React.Fragment>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      Get Statistics
                    </React.Fragment>
                  )}
                </a>
              </div>
              {statisticsAlert && (
                <div className="statistics-alert">
                  <p>Statistics are downloaded</p>
                </div>
              )}

              {/* New section */}
              <div className="input-box">
                <input type="text" id="url-input" value={scanUrl} onChange={(e) => setScanUrl(e.target.value)} required />
                <label htmlFor="url-input">Enter URL</label>
              </div>
              <a href="#" id="scan-website-btn" onClick={handleScanWebsite}>
                {isLoadingScan ? (
                  <div className="loading-icon">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <React.Fragment>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Scan
                  </React.Fragment>
                )}
              </a>
              {scanResult && (
                <div className="scan-result">
                  <p>{scanResult}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
