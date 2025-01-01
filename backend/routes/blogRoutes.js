const express = require('express');
const fs = require('fs');
const path = require('path');
const BlogPost = require('../models/BlogPost');
const { authenticate } = require('../middleware/authMiddleware'); // Middleware to protect routes
const upload = require('../middleware/uploadMiddleware'); // Import Multer middleware
const router = express.Router();

// Create a new blog post
router.post('/', authenticate, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const newPost = await BlogPost.create({
      title,
      content,
      imageUrl,
      author: req.user.id, // Assuming req.user.id is populated by the auth middleware
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const populatedPosts = await BlogPost.find().populate('author', 'name email');
    res.json(populatedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get blog posts by a specific user
router.get('/user', authenticate, async (req, res) => {
  try {
    const posts = await BlogPost.find({ author: req.user.id }).populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user blog posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update a blog post
router.put('/:id', authenticate, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const updatedPost = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content, imageUrl },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found or not authorized' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Upload an image
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update a blog post with optional image update
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const newImageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;

  try {
    const blogPost = await BlogPost.findOne({ _id: req.params.id, author: req.user.id });

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found or not authorized' });
    }

    // If a new image is uploaded and an old image exists, delete the old image
    if (newImageUrl && blogPost.imageUrl) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(blogPost.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err.message);
          } else {
            console.log('Old image deleted:', oldImagePath);
          }
        });
      }
    }

    // Update the blog post fields
    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;
    blogPost.imageUrl = newImageUrl || blogPost.imageUrl;

    const updatedPost = await blogPost.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete a blog post and its associated image
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, author: req.user.id });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found or not authorized' });
    }

    // If the post has an associated image, delete it
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(post.imageUrl));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err.message);
        } else {
          console.log('Image deleted:', imagePath);
        }
      });
    }

    await post.deleteOne();
    res.json({ message: 'Blog post and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete an uploaded image and update the blog post
router.delete('/upload/:filename', authenticate, async (req, res) => {
  const { filename } = req.params;

  try {
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}. Proceeding with database update.`);
    } else {
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err.message);
          return res.status(500).json({ message: 'Error deleting file' });
        }
        console.log(`File deleted: ${filePath}`);
      });
    }

    // Update the blog post to remove the imageUrl
    const updatedPost = await BlogPost.findOneAndUpdate(
      { imageUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}` },
      { imageUrl: null },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'No associated blog post found for the image' });
    }

    res.json({ message: 'Image deletion and database update completed', updatedPost });
  } catch (error) {
    console.error('Error handling file deletion:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;