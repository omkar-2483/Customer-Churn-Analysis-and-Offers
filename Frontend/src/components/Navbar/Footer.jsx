import React from 'react';
import './Navbar.css'; // Import your CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2>BharatNet</h2>
                <p>Connecting India with seamless communication solutions.</p>
                <div className="footer-links">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-of-service">Terms of Service</a>
                    <a href="/contact">Contact Us</a>
                </div>
                <div className="footer-socials">
                    <a href="#" aria-label="Facebook">Facebook</a>
                    <a href="#" aria-label="Twitter">Twitter</a>
                    <a href="#" aria-label="LinkedIn">LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 BharatNet. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
