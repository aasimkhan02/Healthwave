import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onSwitchToLogin, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
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
                console.log('Registration successful:', data);
                onSuccess();
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className='Signup'>
            <div className='signup-container'>
                <button className='close-btn' onClick={onClose}>×</button>
                <h2>Create a new account</h2>
                <form className='signup-form' onSubmit={handleSubmit}>
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
                    
                    <label htmlFor='confirm-password'>Confirm Password</label>
                    <input
                        type='password'
                        id='confirm-password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    
                    <button type='submit'>Sign Up</button>
                    {error && <p>{error}</p>}
                </form>
                <h3>Already have an account? <a href="#" onClick={onSwitchToLogin}>Log in</a></h3>
            </div>
        </div>
    );
};

export default Signup;
