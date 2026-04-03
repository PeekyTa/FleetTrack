import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AuthUser } from '../types/index';
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}
const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });
export const useSocket = () => useContext(SocketContext);
interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) return;
    try {
      const user: AuthUser = JSON.parse(stored);
      if (!user.token) return;
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: { token: user.token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });
      newSocket.on('connect', () => {
        console.log('🔌 WebSocket connecté');
        setConnected(true);
      });
      newSocket.on('disconnect', () => {
        console.log('❌ WebSocket déconnecté');
        setConnected(false);
      });
      newSocket.on('connect_error', (err) => {
        console.warn('⚠️ Erreur WebSocket:', err.message);
        setConnected(false);
      });
      socketRef.current = newSocket;
      return () => {
        newSocket.close();
        socketRef.current = null;
        setConnected(false);
      };
    } catch {
          }
  }, []);
  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
