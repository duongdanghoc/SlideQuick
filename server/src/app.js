// src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./config/database');
const { uploadDir } = require('./middleware/upload');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));
app.use(
  '/ai-image-fixtures',
  express.static(path.join(__dirname, 'features/ai-image/fixtures')),
);

// Initialize database
initializeDatabase();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Máy chủ EduArt AI API đang hoạt động 🚀' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Lỗi máy chủ:', err);

  // Multer errors
  if (err.message === 'Chỉ chấp nhận tải lên các tệp hình ảnh') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Dung lượng tệp quá lớn (Tối đa: 5MB)' });
  }

  res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
});

module.exports = app;
