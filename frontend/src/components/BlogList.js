import React, { useEffect, useState } from "react";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetch("http://localhost:5000/blogs")
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
  }, []);

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div>Error loading blogs: {error}</div>;
  }

  return (
    <div>
      <h1>Blog Posts</h1>
      {blogs.length === 0 ? (
        <div>No blog posts available.</div>
      ) : (
        <div>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
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