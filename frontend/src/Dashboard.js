import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylings/Dashboard.css';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const token = localStorage.getItem('token'); // Retrieve token
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/blogs/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setBlogs(data);
          } else {
            setBlogs([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('Authentication token missing');
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await fetch(`http://localhost:5000/blogs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading your blog posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <h2>My Dashboard</h2>
        <button onClick={() => navigate('/')} className="dashboard-home-button">
          Home
        </button>
      </nav>

      {/* Blog Section */}
      <main>
        <h1 className="dashboard-title">My Blog Posts</h1>
        <button
          onClick={() => navigate('/blogs/editor')}
          className="dashboard-create-button"
        >
          Create New Blog Post
        </button>

        <div className="dashboard-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="dashboard-blog-card">
              <img src={blog.imageUrl} alt="Blog" className="dashboard-blog-image" />
              <h2 className="dashboard-blog-title">{blog.title}</h2>
              <p className="dashboard-blog-content">
                {blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content}
              </p>
              <p className="dashboard-blog-author">By {blog.author?.username || 'Unknown'}</p>
              <div className="dashboard-actions">
                <button
                  onClick={() => navigate(`/blogs/editor/${blog._id}`)}
                  className="dashboard-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="dashboard-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

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

export default Dashboard;