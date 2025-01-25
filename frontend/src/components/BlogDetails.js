import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../stylings/BlogDetails.css'; // Import the CSS file

const BlogDetails = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/blogs/${id}`) // Fetch blog details
      .then((response) => response.json())
      .then((data) => setBlog(data))
      .catch((error) => console.error('Error fetching blog details:', error));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

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
        <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
      <p>Follow Us:</p>
      <div className="dashboard-social-links">
        <a href="https://www.linkedin.com/in/kotzee-kenan-175ab4284" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://x.com/MrColliyone" className="social-link" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://www.facebook.com/keanu.kotzee" className="social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://github.com/KeanuColliyone" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
     </div>
    </footer>
    </div>
  );
};

export default BlogDetails;