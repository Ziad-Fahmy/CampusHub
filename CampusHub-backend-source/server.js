// Main server file for CampusHub backend
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Initialize Middleware
app.use(express.json({ extended: false, limit: '10mb' }));

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/classrooms', require('./routes/classrooms'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/complaints', require('./routes/complaints'));

// Chatbot routes - Use the improved chatbot implementation
app.use('/api/chatbot', require('./routes/chatbot'));

// Health check endpoint for the entire API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CampusHub Backend API',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'CampusHub Backend API',
    version: '1.1.0',
    endpoints: {
      auth: '/api/auth',
      classrooms: '/api/classrooms',
      facilities: '/api/facilities',
      events: '/api/events',
      bookings: '/api/bookings',
      restaurants: '/api/restaurants',
      complaints: '/api/complaints',
      chatbot: '/api/chatbot',
      health: '/api/health'
    },
    chatbot_endpoints: {
      chat: 'POST /api/chatbot/chat',
      health: 'GET /api/chatbot/health',
      test: 'GET /api/chatbot/test',
      categories: 'GET /api/chatbot/categories'
    },
    timestamp: new Date().toISOString()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    available_endpoints: [
      '/api/auth',
      '/api/classrooms',
      '/api/facilities',
      '/api/events',
      '/api/bookings',
      '/api/restaurants',
      '/api/complaints',
      '/api/chatbot',
      '/api/health'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: isDevelopment ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`🤖 Chatbot API: http://localhost:${PORT}/api/chatbot`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

