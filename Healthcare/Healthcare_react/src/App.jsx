import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; 
import Landing from './pages/Landing/Landing';
import Medication from './pages/Medication/Medication';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Profile from './pages/Profile/Profile';


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isSignupVisible, setSignupVisible] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    const toggleLogin = () => {
        setLoginVisible(!isLoginVisible);
        if (isSignupVisible) {
            setSignupVisible(false);
        }
    };

    const toggleSignup = () => {
        setSignupVisible(!isSignupVisible);
        if (isLoginVisible) {
            setLoginVisible(false);
        }
    };

    const closeLogin = () => setLoginVisible(false);
    const closeSignup = () => setSignupVisible(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar 
                                toggleLogin={toggleLogin} 
                                isAuthenticated={isAuthenticated}
                                onLogout={handleLogout}
                            />
                            <Landing />
                        </>
                    }
                />
                <Route
                    path="/medication"
                    element={
                        <>
                            <Navbar 
                                toggleLogin={toggleLogin} 
                                isAuthenticated={isAuthenticated}
                                onLogout={handleLogout}
                            />
                            <Medication />
                        </>
                    }
                />
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <div>Dashboard Content</div> : <Navigate to="/" />}
                />
                <Route
                    path="/profile"
                    element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
                />
            </Routes>
            {/* <Footer /> */}
            {isLoginVisible && (
                <div className="login-overlay">
                    <Login onSwitchToSignup={toggleSignup} onClose={closeLogin} onSuccess={handleLogin} />
                </div>
            )}
            {isSignupVisible && (
                <div className="login-overlay">
                    <Signup onSwitchToLogin={toggleSignup} onClose={closeSignup} onSuccess={handleLogin} />
                </div>
            )}
        </Router>
    );
};

export default App;
