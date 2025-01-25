const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v); // Validate URL format
        },
        message: 'Invalid URL format for imageUrl',
      },
    },
    thumbnailUrl: {
      type: String, // Optional field for storing thumbnails
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft', // Default to draft
    },
    tags: [
      {
        type: String, // Array of tags for categorization
      },
    ],
  },
  { timestamps: true }
);

// Middleware to set a default imageUrl if none is provided
blogPostSchema.pre('save', function (next) {
  if (!this.imageUrl) {
    this.imageUrl = 'https://via.placeholder.com/300'; // Default placeholder image
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;