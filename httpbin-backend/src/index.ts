// Generate a simple express application with a single route
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoHttpbinResponseRepository } from './infrastructure/database/repositories/MongoHttpbinResponseRepository';
import { SocketIOService } from './infrastructure/websocket/SocketIOService';
import { MonitorHttpbin } from './application/use-cases/MonitorHttpbin';
import { HttpbinController } from './presentation/controllers/HttpbinController';
import cron from 'node-cron';
import logger from './infrastructure/logger';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Setup dependencies
const repository = new MongoHttpbinResponseRepository();
const wsService = new SocketIOService(io);
const monitor = new MonitorHttpbin(repository, wsService);
const controller = new HttpbinController(repository);

// Routes
app.get('/api/responses', (req, res) => controller.getAll(req, res));
app.get('/api/responses/range', (req, res) =>
  controller.getByDateRange(req, res),
);

// Start monitoring
// setInterval(() => {
//   monitor.execute();
// }, parseInt(process.env.HTTPBIN_INTERVAL!) || 300000);

cron.schedule('*/5 * * * *', async () => {
  logger.info('Running monitor every 5 minutes.');
  await monitor.execute();
  logger.info(`${new Date().toUTCString()} Monitoring complete.`);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected');
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  // Database connection
  mongoose
    .connect(
      process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/httpbin_monitor',
    )
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('MongoDB connection error:', err));

  logger.info(`Server is running on port ${PORT}`);
});
