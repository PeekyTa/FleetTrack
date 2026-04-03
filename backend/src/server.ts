import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { swaggerSpec } from './utils/swagger.js';
import { initSocket } from './socket/socketHandler.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import geofenceRoutes from './routes/geofenceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer, config.corsOrigin);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FleetTrack API — Documentation',
}));
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.get('/', (req, res) => {
  res.json({
    message: 'FleetTrack API — Tableau de Bord de Géolocalisation POC',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});
app.use(notFound);
app.use(errorHandler);
httpServer.listen(config.port, () => {
  console.log(`
🚀 Serveur FleetTrack démarré
📡 Port: ${config.port}
🌐 API: http://localhost:${config.port}
📖 Docs: http://localhost:${config.port}/api/docs
🔌 WebSocket: ws://localhost:${config.port}
🏗️  Env: ${config.nodeEnv}
  `);
});
export { app, io };
