// server.js - VILS BUS.COM Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tripsRoutes from './routes/trips.js';
import bookingsRoutes from './routes/bookings.js';
import offersRoutes from './routes/offers.js';
import citiesRoutes from './routes/cities.js';
import chatbotRoutes from './routes/chatbot.js';
import adminRoutes from './routes/admin.js';
import store from './models/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Configurable CORS origins
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Comprehensive Health check
app.get('/api/health', (req, res) => {
  const dbStatus = store && store.data ? 'healthy' : 'error';
  res.json({
    status: 'online',
    brand: 'VILS BUS.COM',
    version: process.env.APP_VERSION || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      tripsCount: store.data?.trips?.length || 0,
      bookingsCount: store.data?.bookings?.length || 0,
      usersCount: store.data?.users?.length || 0,
      activeHolds: store.data?.seatHolds?.length || 0
    },
    timestamp: new Date().toISOString()
  });
});

// Root API info
app.get('/', (req, res) => {
  res.json({
    brand: 'VILS BUS.COM API',
    status: 'running',
    healthCheck: '/api/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred',
    details: err.message
  });
});

// Start Server listening on 0.0.0.0
const server = app.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(`🚀 VILS BUS.COM Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 API Endpoint: http://${HOST}:${PORT}/api`);
  console.log(`===============================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  store.save();
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  store.save();
  server.close(() => process.exit(0));
});
