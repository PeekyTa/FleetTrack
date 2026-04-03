import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
let io: SocketServer;
export function initSocket(httpServer: HttpServer, corsOrigin: string): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log(`🔌 Client connecté: ${socket.id}`);
    socket.on('join:room', (room: string) => {
      socket.join(room);
      console.log(`📡 ${socket.id} rejoint le salon: ${room}`);
    });
    socket.on('leave:room', (room: string) => {
      socket.leave(room);
    });
    socket.on('disconnect', () => {
      console.log(`❌ Client déconnecté: ${socket.id}`);
    });
  });
  return io;
}
export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io non initialisé');
  return io;
}
export const socketEmit = {
  deviceLocationUpdate(data: {
    deviceId: number;
    latitude: number;
    longitude: number;
    speed?: number;
    timestamp: string;
  }) {
    if (io) io.emit('device:locationUpdate', data);
  },
  deviceStatusChange(data: {
    deviceId: number;
    status: string;
    battery?: number;
    signal?: number;
  }) {
    if (io) io.emit('device:statusChange', data);
  },
  newAlert(data: {
    id: number;
    type: string;
    severity: string;
    deviceId: number;
    deviceName: string;
    message: string;
  }) {
    if (io) io.emit('alert:new', data);
  },
  alertAcknowledged(data: { id: number; acknowledgedBy: number }) {
    if (io) io.emit('alert:acknowledged', data);
  },
};
