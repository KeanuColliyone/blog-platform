const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory is created recursively
  console.log('Upload directory created:', uploadDir);
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Sanitize the file name to remove problematic characters
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${sanitizedFileName}`); // Rename file to include a timestamp
  },
});

// File filter to allow only specific types
const fileFilter = (req, file, cb) => {
  console.log('File mimetype:', file.mimetype); // Debugging: Log the mimetype
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error(`Rejected file type: ${file.mimetype}`);
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

// Error handling for multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    console.error(`Multer error: ${err.message}`);
    res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    // Handle other errors
    console.error(`File upload error: ${err.message}`);
    res.status(400).json({ message: `File upload error: ${err.message}` });
  } else {
    next();
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = {
  upload,
  handleMulterErrors,
};