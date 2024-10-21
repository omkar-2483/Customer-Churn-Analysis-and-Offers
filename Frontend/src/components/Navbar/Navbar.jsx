import React from 'react';
import './Navbar.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>BharatNet</h1>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Services</Link></li>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Contacts</Link></li>
                <li><Link to="/">Support</Link></li>
            </ul>
            <ul className='navbar-links'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/offers">Offers</Link></li>
                {/* Add more links as needed */}
            </ul>
        </nav>
    );
};

export default Navbar;
