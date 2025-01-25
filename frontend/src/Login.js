import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylings/Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  // Dynamic API Base URL
  const API_BASE_URL =
    window.location.hostname !== 'localhost'
      ? 'https://protected-stream-14951.herokuapp.com'
      : 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
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

      // Save token and user information
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to the dashboard
      alert('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="login-title">Login to Your Account</h1>
          <div className="social-login">
            <button
              type="button"
              className="social-button facebook"
              aria-label="Login with Facebook"
            >
              F
            </button>
            <button
              type="button"
              className="social-button google"
              aria-label="Login with Google"
            >
              G
            </button>
            <button
              type="button"
              className="social-button linkedin"
              aria-label="Login with LinkedIn"
            >
              L
            </button>
          </div>
          <p className="or-text">or</p>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="login-input"
            aria-label="Email or Username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            aria-label="Password"
          />
          <button type="submit" className="login-button" aria-label="Sign In">
            Sign In
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <h2 className="signup-title">New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities!</p>
        <button
          className="signup-button"
          onClick={() => navigate('/signup')}
          aria-label="Sign Up"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;