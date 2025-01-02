const express = require('express');
const fs = require('fs');
const path = require('path');
const BlogPost = require('../models/BlogPost');
const { authenticate } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const router = express.Router();

// Create a new blog post
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;

  try {
    const newPost = await BlogPost.create({
      title,
      content,
      imageUrl,
      author: req.user.id,
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
    const posts = await BlogPost.find().populate('author', 'username email');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get blog posts by a specific user
router.get('/user', authenticate, async (req, res) => {
  try {
    const posts = await BlogPost.find({ author: req.user.id }).populate('author', 'username email');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user blog posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username email');
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

    // Delete old image if a new one is uploaded
    if (newImageUrl && blogPost.imageUrl) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(blogPost.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      }
    }

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

// Delete a blog post and its image
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ _id: req.params.id, author: req.user.id });

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found or not authorized' });
    }

    if (blogPost.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(blogPost.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Image deleted:', imagePath);
      }
    }

    await blogPost.deleteOne();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete an uploaded image
router.delete('/upload/:filename', authenticate, async (req, res) => {
  const { filename } = req.params;

  try {
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted:', filePath);
    } else {
      console.warn(`File not found: ${filePath}`);
    }

    const updatedPost = await BlogPost.findOneAndUpdate(
      { imageUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}` },
      { imageUrl: null },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'No associated blog post found for the image' });
    }

    res.json({ message: 'Image deletion completed', updatedPost });
  } catch (error) {
    console.error('Error deleting uploaded image:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
