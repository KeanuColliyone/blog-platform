import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor'; // Markdown editor import
import '../stylings/BlogEditor.css';

const BlogEditor = ({ onSubmit }) => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

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
          setImagePreview(data.imageUrl);
        })
        .catch((error) => {
          console.error('Error fetching blog:', error);
          setError('Failed to load blog details.');
        });
    }
  }, [blogId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
    <div className="blog-editor-container">
      {/* Navbar */}
      <nav className="blog-editor-navbar">
        <h2>Blog Editor</h2>
        <div>
          <button onClick={() => navigate('/')} className="nav-button">Home</button>
          <button onClick={() => navigate('/dashboard')} className="nav-button">Dashboard</button>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="blog-editor-form">
        <h1>{blogId ? 'Edit Blog' : 'Create New Blog'}</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter the blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <MDEditor
            value={content}
            onChange={setContent}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input type="file" id="image" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>
        <button type="submit" className="submit-button">
          {blogId ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>

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

BlogEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default BlogEditor;