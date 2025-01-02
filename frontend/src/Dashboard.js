import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const token = localStorage.getItem('token'); // Retrieve the token dynamically
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
    <div>
      <h1>My Blog Posts</h1>
      <button
        onClick={() => navigate('/blogs/editor')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create New Blog Post
      </button>
      {blogs.length === 0 ? (
        <div>No blog posts found.</div>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              margin: '10px',
            }}
          >
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt="Blog"
                style={{ width: '100%', maxHeight: '300px' }}
              />
            )}
            <button
              onClick={() => navigate(`/blogs/editor/${blog._id}`)}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: '#28A745',
                color: '#FFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#DC3545',
                color: '#FFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;