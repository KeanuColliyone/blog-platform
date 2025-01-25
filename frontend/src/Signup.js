import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylings/Signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  // Dynamic API Base URL
  const API_BASE_URL =
    window.location.hostname !== 'localhost'
      ? 'https://protected-stream-14951-b7b45def3c42.herokuapp.com'
      : 'http://localhost:5000';

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful! Redirecting to login...');
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error.message);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2 className="signup-title">Sign up</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="signup-input"
          aria-label="First Name"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="signup-input"
          aria-label="Last Name"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="signup-input"
          aria-label="Username"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-input"
          aria-label="Email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-input"
          aria-label="Password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="signup-input"
          aria-label="Confirm Password"
        />
        <button type="submit" className="signup-button" aria-label="Sign up">
          Sign up
        </button>
      </form>
      <div className="signup-footer">
        <p>Already have an account?</p>
        <button
          onClick={() => navigate('/login')}
          className="login-button"
          aria-label="Go to Login"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;