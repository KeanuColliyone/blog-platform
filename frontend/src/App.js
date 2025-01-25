import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import BlogList from './components/BlogList';
import Homepage from './components/Homepage';
import BlogEditor from './components/BlogEditor';
import BlogDetails from './components/BlogDetails';

// API Base URL based on the environment
const API_BASE_URL =
  window.location.hostname !== 'localhost'
    ? 'https://protected-stream-14951.herokuapp.com'
    : 'http://localhost:5000';

function App() {
  const handleSubmitBlog = async (formData, blogId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to perform this action.');
      return;
    }

    const url = `${API_BASE_URL}/blogs/${blogId || ''}`;
    const method = blogId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error:', errorDetails.message || response.statusText);
        throw new Error(
          `Failed to ${blogId ? 'update' : 'create'} blog: ${errorDetails.message || response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error('Submission error:', error.message);
      throw error;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route
          path="/blogs/editor"
          element={<BlogEditor onSubmit={handleSubmitBlog} />}
        />
        <Route
          path="/blogs/editor/:blogId"
          element={<BlogEditor onSubmit={handleSubmitBlog} />}
        />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;