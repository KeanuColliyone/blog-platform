import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylings/Homepage.css';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL =
    window.location.hostname !== 'localhost'
      ? 'https://protected-stream-14951.herokuapp.com'
      : 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/blogs`)
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error('Error fetching blogs:', error.message));

    const userLoggedIn = localStorage.getItem('token'); // Check if a token is stored
    setIsLoggedIn(!!userLoggedIn);
  }, [API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  const handleDashboardClick = () => {
    navigate(isLoggedIn ? '/dashboard' : '/login');
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-logo">EXTRA</h1>
        <nav className="homepage-nav">
          <ul className="nav-links">
            <li>
              <button className="homepage-button" onClick={handleDashboardClick}>
                Dashboard
              </button>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <button
                    className="homepage-button"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    className="homepage-button"
                    onClick={() => navigate('/signup')}
                  >
                    Signup
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className="homepage-button logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      {blogs.length > 0 ? (
        <section className="featured-blog">
          <img
            src={blogs[0].imageUrl || '/path/to/default-image.jpg'}
            alt={blogs[0].title}
            className="featured-image"
            onClick={() => handleBlogClick(blogs[0]._id)}
            style={{ cursor: 'pointer' }}
          />
          <div className="featured-content">
            <h2 className="featured-title">{blogs[0].title}</h2>
            <p className="featured-author">
              By {blogs[0].author?.username || 'Unknown'}
            </p>
            <p className="featured-text">
              {blogs[0].content.length > 200
                ? `${blogs[0].content.slice(0, 200)}...`
                : blogs[0].content}
            </p>
          </div>
        </section>
      ) : (
        <p>No blogs available</p>
      )}

      <section className="homepage-grid">
        {blogs.slice(1).map((blog) => (
          <div
            key={blog._id}
            className="homepage-blog-card"
            onClick={() => handleBlogClick(blog._id)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={blog.imageUrl || '/path/to/default-image.jpg'}
              alt={blog.title}
              className="homepage-blog-image"
            />
            <h3 className="homepage-blog-title">{blog.title}</h3>
            <p className="homepage-blog-content">
              {blog.content.length > 100
                ? `${blog.content.slice(0, 100)}...`
                : blog.content}
            </p>
            <p className="homepage-blog-author">
              By {blog.author?.username || 'Unknown'}
            </p>
          </div>
        ))}
      </section>

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

export default Homepage;