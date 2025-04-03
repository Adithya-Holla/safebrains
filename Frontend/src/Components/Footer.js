import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Safebrains</h2>
          <p>Empowering early detection with AI</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Navigation</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/tools">Tools</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li><a href="mailto:adithyavholla23@gmail.com"><i className="fas fa-envelope"></i>adithyavholla23@gmail.com </a></li>
              <li><a href="tel:+1234567890"><i className="fas fa-phone"></i> </a></li>
              <li><i className="fas fa-map-marker-alt"></i> Bengaluru, India</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Safebrains. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;