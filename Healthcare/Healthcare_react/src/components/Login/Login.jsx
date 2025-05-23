import React, { useState } from 'react';
import './Login.css';

const Login = ({ onSwitchToSignup, onSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    password 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful:', data);
                // Store access and refresh tokens in localStorage
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('isAuthenticated', 'true'); // Optional, for UI state
                localStorage.setItem('username', data.username); // Store username

                onSuccess(); // Notify parent component of successful login
                onClose();   // Close the login overlay
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className='Login'>
            <div className='login-container'>
                <button className='close-btn' onClick={onClose}>×</button>
                <h2>Log into your account</h2>
                <form className='login-form' onSubmit={handleSubmit}>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <button type='submit'>Login</button>
                    {error && <p>{error}</p>}

                    <h3>Don't have an account? <a href="#" onClick={onSwitchToSignup}>Sign up</a></h3>
                </form>
            </div>
        </div>
    );
};

export default Login;
