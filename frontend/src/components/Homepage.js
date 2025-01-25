import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylings/Homepage.css';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL =
    window.location.hostname !== 'localhost'
      ? 'https://protected-stream-14951-b7b45def3c42.herokuapp.com'
      : 'http://localhost:5000';

  // Helper function to truncate text safely
  const truncateText = (text, maxLength) => {
    if (typeof text === 'string') {
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }
    return 'Invalid content'; // Fallback for non-string content
  };

  useEffect(() => {
    // Fetch blogs
    fetch(`${API_BASE_URL}/blogs`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error('Blogs API response is not an array:', data);
        }
      })
      .catch((error) => console.error('Error fetching blogs:', error.message));

    const userLoggedIn = localStorage.getItem('token');
    setIsLoggedIn(!!userLoggedIn);
  }, [API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
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
        <h1 className="homepage-logo">BLOGTAKU</h1>
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

      {/* Featured Blog Section */}
      {blogs.length > 0 ? (
        <section className="featured-blog">
          <img
            src={blogs[0]?.imageUrl || '/path/to/default-image.jpg'}
            alt={blogs[0]?.title || 'Featured Blog'}
            className="featured-image"
            onClick={() => handleBlogClick(blogs[0]._id)}
            style={{ cursor: 'pointer' }}
          />
          <div className="featured-content">
            <h2 className="featured-title">{blogs[0]?.title || 'No Title'}</h2>
            <p className="featured-author">
              By {blogs[0]?.author?.username || 'Unknown'}
            </p>
            <p className="featured-text">{truncateText(blogs[0]?.content, 200)}</p>
          </div>
        </section>
      ) : (
        <p>No blogs available</p>
      )}

      {/* Blog Grid Section */}
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
              alt={blog.title || 'Blog'}
              className="homepage-blog-image"
            />
            <h3 className="homepage-blog-title">{blog.title || 'No Title'}</h3>
            <p className="homepage-blog-content">{truncateText(blog.content, 100)}</p>
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