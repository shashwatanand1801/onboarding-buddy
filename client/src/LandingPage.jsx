// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import buddyImage from './assets/buddy.jpg'; // Import your image

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="header">
        <img src={buddyImage} alt="Onboarding Buddy" className="buddy-image" />
        <h1>Welcome to the Onboarding Buddy Site</h1>
        <p>Find your onboarding buddy and get started!</p>
      </div>
      <div className="action-buttons">
        <Link to="/admin" className="button">
          Admin Page
        </Link>
        <Link to="/bot" className="button">
          Chat Bot
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
