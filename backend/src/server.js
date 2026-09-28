import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import { initSocket } from './sockets/socketManager.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { getPgStatus } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Global Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// API Health & Root
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    postgres: getPgStatus(),
    version: '1.0.0',
    service: 'Customer Food Order Management System Backend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Server Listen
const PORT = config.port;
if (process.env.NODE_ENV !== 'test' && !httpServer.listening) {
  httpServer.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Central Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket / Socket.io Engine ready for real-time events`);
    console.log(`🍔 Ready for Customer, Restaurant, Delivery, & Admin portals`);
    console.log(`======================================================\n`);
  });
}

export { app, httpServer };
