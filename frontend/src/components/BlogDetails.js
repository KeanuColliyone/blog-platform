import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../stylings/BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dynamic API Base URL
  const API_BASE_URL =
    window.location.hostname !== 'localhost'
      ? 'https://protected-stream-14951-b7b45def3c42.herokuapp.com'
      : 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/blogs/${id}`) // Fetch blog details
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching blog: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setBlog(data))
      .catch((error) => {
        console.error('Error fetching blog details:', error);
        setError('Failed to load the blog. Please try again later.');
      });
  }, [id, API_BASE_URL]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!blog) {
    return (
      <div className="loading-container">
        <p>Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="blog-details-container">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="navbar-logo">EXTRA</h1>
        <button className="navbar-button" onClick={() => navigate('/')}>
          Back to Homepage
        </button>
      </header>

      {/* Blog Content */}
      <div className="blog-details-content">
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-author">
          By <span className="author-username">{blog.author?.username || 'Unknown'}</span>
        </p>
        <p className="blog-text">{blog.content}</p>
      </div>

      {/* Blog Image */}
      <div className="blog-details-image-container">
        <img
          src={blog.imageUrl || '/path/to/default-image.jpg'}
          alt={blog.title}
          className="blog-image"
        />
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Follow Us:</p>
        <div className="dashboard-social-links">
          <a
            href="https://www.linkedin.com/in/kotzee-kenan-175ab4284"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/MrColliyone"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://www.facebook.com/keanu.kotzee"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://github.com/KeanuColliyone"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetails;