import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate(); // To navigate to other pages

  useEffect(() => {
    fetch('http://localhost:5000/blogs') // API endpoint to fetch all blogs
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  return (
    <div>
      <h1>All Blog Posts</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => navigate('/signup')}>
          Signup
        </button>
      </div>
      {blogs.map((blog) => (
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
          <p>Author: {blog.author?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Homepage;