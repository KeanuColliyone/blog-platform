import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import BlogList from './components/BlogList';
import Homepage from './components/Homepage'; // Ensure the Homepage file is created in the right path
import BlogEditor from './components/BlogEditor'; // Ensure the BlogEditor file is created in the right path

function App() {
  const handleSubmitBlog = async (formData, blogId) => {
    const token = localStorage.getItem('token');
    const url = blogId
      ? `http://localhost:5000/blogs/${blogId}`
      : 'http://localhost:5000/blogs';
    const method = blogId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${blogId ? 'update' : 'create'} blog`);
    }

    return response.json();
  };

  return (
    <Router>
      <Routes>
        {/* Homepage to display all blog posts */}
        <Route path="/" element={<Homepage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Blog Management */}
        <Route path="/blogs" element={<BlogList />} />
        <Route
          path="/blogs/editor"
          element={<BlogEditor onSubmit={handleSubmitBlog} />}
        />
        <Route
          path="/blogs/editor/:blogId"
          element={<BlogEditor onSubmit={handleSubmitBlog} />}
        />
      </Routes>
    </Router>
  );
}

export default App;