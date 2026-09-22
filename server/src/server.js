// src/server.js
const http = require('http');
const app = require('./app');
const { PORT } = require('./config/env');
const { initYjsServer } = require('./services/yjs-server');

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

// Initialize Y.js WebSocket server on /yjs path
initYjsServer(server, '/yjs');

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Máy chủ EduArt AI API đã khởi chạy`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/projects`);
  console.log(`🔄 Y.js WebSocket: ws://localhost:${PORT}/yjs\n`);
});
