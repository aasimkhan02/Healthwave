import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here
import './Navbar.css';

const Navbar = ({ toggleLogin, isAuthenticated, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [color, setColor] = useState(false);
    const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const changeColor = () => {
        if (window.scrollY >= 90) {
            setColor(true);
        } else {
            setColor(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeColor);
        return () => {
            window.removeEventListener('scroll', changeColor);
        };
    }, []);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const toggleDashboardDropdown = () => setDashboardDropdownOpen(!dashboardDropdownOpen);

    const handleLogout = () => {
        onLogout();
        // Optionally, redirect to the home page or login page after logout
        navigate('/');
    };

    return (
        <div className={`Navbar container ${color ? 'scrolled' : ''}`}>
            <h1>HealthWave</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li 
                    className="dropdown" 
                    onMouseEnter={toggleDropdown} 
                    onMouseLeave={toggleDropdown}
                >
                    <span>Services</span>
                    {dropdownOpen && (
                        <ul className="dropdown-menu">
                            <li>
                                <a href="https://multiplediseaseprediction-uc89fhqvet96epogcvotqv.streamlit.app/" target="_blank" rel="noopener noreferrer">
                                    Disease
                                </a>
                            </li>
                            <li><Link to="/medication">Medication</Link></li>
                            <li><a href="http://localhost:8000/education/">Education</a></li>
                        </ul>
                    )}
                </li>
                
                <li><Link to="/contact">Contact</Link></li>
                {isAuthenticated ? (
                    <li 
                        className="dropdown"
                        onMouseEnter={toggleDashboardDropdown}
                        onMouseLeave={() => setDashboardDropdownOpen(false)}
                    >
                        <button className='dashboard button'>Dashboard</button>
                        {dashboardDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/settings">Settings</Link></li>
                                <li onClick={handleLogout}>Logout</li>
                            </ul>
                        )}
                    </li>
                ) : (
                    <button className='button' onClick={toggleLogin}>Login</button>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
