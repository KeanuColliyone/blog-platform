import React, { useEffect, useState } from "react";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Determine the base API URL
  const API_BASE_URL =
    window.location.hostname !== "localhost"
      ? "https://protected-stream-14951.herokuapp.com" // Heroku backend
      : "http://localhost:5000"; // Local development

  useEffect(() => {
    // Fetch blogs from the API
    fetch(`${API_BASE_URL}/blogs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched blogs:", data);
        setBlogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <p>Error loading blogs: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Blog Posts</h1>
      {blogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No blog posts available.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "20px" }}>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>{blog.title}</h2>
              <p>
                {blog.content.length > 150
                  ? `${blog.content.slice(0, 150)}...`
                  : blog.content}
              </p>
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  alt="Blog visual"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              ) : (
                <p style={{ color: "#888" }}>No image for this blog post.</p>
              )}
              <small>
                <strong>Author:</strong> {blog.author?.name || "Unknown Author"}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;