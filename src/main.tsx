import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import App from './app/App';
import './styles/index.css';
createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>
);