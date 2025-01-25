import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylings/Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername: identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login successful');
      navigate('/dashboard');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="login-title">Login to Your Account</h1>
          <div className="social-login">
            <button type="button" className="social-button facebook">F</button>
            <button type="button" className="social-button google">G</button>
            <button type="button" className="social-button linkedin">L</button>
          </div>
          <p className="or-text">or</p>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <h2 className="signup-title">New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities!</p>
        <button className="signup-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;