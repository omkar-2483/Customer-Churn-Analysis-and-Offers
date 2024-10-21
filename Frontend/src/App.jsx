import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './components/adminPage/AdminPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Navbar/Footer';
import HomePage from './components/homePage/HomePage';
import OffersPage from './components/offersPage/OffersPage';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className='App'>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} /> {/* Replace HomePage with your actual component */}
                    <Route path="/admin" element={<AdminPage />} /> {/* Admin Dashboard route */}
                    <Route path="/offers" element={<OffersPage/>}/>
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;

