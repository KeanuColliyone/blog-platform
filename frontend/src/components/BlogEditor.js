import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';

const BlogEditor = ({ onSubmit }) => {
  const { blogId } = useParams(); // Get blogId from route params
  const navigate = useNavigate(); // For navigation
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch existing blog details if editing
  useEffect(() => {
    if (blogId) {
      fetch(`http://localhost:5000/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching blog: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((error) => {
          console.error('Error fetching blog:', error);
          setError('Failed to load blog details.');
        });
    }
  }, [blogId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    setError(null);
    onSubmit(formData, blogId)
      .then(() => {
        alert(blogId ? 'Blog updated successfully!' : 'Blog created successfully!');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error submitting blog:', error);
        setError('Failed to submit the blog.');
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
      <h1>{blogId ? 'Edit Blog' : 'Create New Blog'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter the blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          placeholder="Write your blog content here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', height: '150px', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <button type="submit" style={{ padding: '10px 20px' }}>
        {blogId ? 'Update Blog' : 'Create Blog'}
      </button>
    </form>
  );
};

BlogEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default BlogEditor;