import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <LocationProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LocationProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
