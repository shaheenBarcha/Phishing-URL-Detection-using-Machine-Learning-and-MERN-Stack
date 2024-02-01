import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [inputURL, setInputURL] = useState('');
  const [prediction, setPrediction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleInputChange = (e) => {
    setInputURL(e.target.value);
    setErrorMessage(''); // Clear error message when input changes
  };

  const handlePrediction = async () => {
    if (!inputURL) {
      setErrorMessage('Please enter a URL'); // Show error message if URL is empty
      return;
    }

    setIsLoading(true); // Set loading to true when the prediction starts

    try {
      const response = await axios.get('http://localhost:4100/get_prediction', {
        params: {
          url: inputURL,
        },
      });
      console.log('API Response:', response.data); // Log the response for debugging purposes
      const { prediction } = response.data;
      setPrediction(prediction);
      setInputURL(''); // Clear the input field
    } catch (error) {
      console.log('Error during prediction:', error);
      setErrorMessage('Error during prediction'); // Show error message if prediction fails
    } finally {
      setIsLoading(false); // Set loading to false when the prediction is done (whether it succeeded or failed)
    }
  };

  return (
    <div className="prediction-container">
      <div className="HPanel">
        <h2 className="title">Prediction API</h2>
        <div className="input-box">
          <input type="text" id="url-input" value={inputURL} onChange={handleInputChange} required />
          <label htmlFor="url-input">Enter URL</label>
        </div>
        <div className="button-container">
<a href="#" id="predict-btn" onClick={handlePrediction}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
              Predict
          </a>
        </div>
        {isLoading && ( // Conditionally render loading icon
          <div className="loading-icon">
            <div className="spinner"></div>
          </div>
        )}
        {errorMessage && (
          <div className="error-container">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}
        {prediction && (
          <div className="result-container">
            <p className="prediction-result">Prediction Result: {prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
