// src/components/HomePage.js
import React from 'react';
import './HomePage.css'; // Don't forget to create this CSS file for styling!

const HomePage = () => {
    return (
        <div>
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to BharatNet</h1>
                    <p>Your trusted partner for seamless connectivity.</p>
                    <button>Get Started</button>
                </div>
            </section>

            <section className="features">
                <h2>Our Features</h2>
                <div className="feature-item">
                    <h3>High-Speed Internet</h3>
                    <p>Experience lightning-fast internet with our advanced network.</p>
                </div>
                <div className="feature-item">
                    <h3>Affordable Plans</h3>
                    <p>Choose from a variety of plans that suit your needs.</p>
                </div>
                <div className="feature-item">
                    <h3>24/7 Customer Support</h3>
                    <p>Our team is always here to assist you.</p>
                </div>
            </section>

            <section className="about">
                <h2>About Us</h2>
                <p>BharatNet is dedicated to providing reliable and affordable telecom services to connect every corner of India.</p>
            </section>

            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <blockquote>
                    <p>"BharatNet has changed the way I connect with my family and friends!" - A satisfied customer</p>
                </blockquote>
            </section>

            <section className="contact">
                <h2>Contact Us</h2>
                <p>If you have any questions, feel free to reach out!</p>
                <button>Contact Support</button>
            </section>
        </div>
    );
};

export default HomePage;

