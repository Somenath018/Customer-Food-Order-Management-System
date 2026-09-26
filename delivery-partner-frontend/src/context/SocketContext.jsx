import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { soundEngine } from '../utils/audio';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingAlert, setIncomingAlert] = useState(null);
  const joinedRoomsRef = useRef(new Set());

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Connect to the backend root socket
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected:', newSocket.id);
      setIsConnected(true);

      // Join the global driver pool room
      newSocket.emit('join', 'driver_pool');
      joinedRoomsRef.current.add('driver_pool');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    // Real-time notification when a new delivery task becomes available
    newSocket.on('delivery:task_ready', (data) => {
      console.log('🚨 New task ready broadcast:', data);
      soundEngine.playNewTaskChime();
      setIncomingAlert({
        type: 'new_task',
        orderId: data.orderId,
        restaurantName: data.restaurantName,
        fee: data.fee,
        message: `New Order Ready at ${data.restaurantName || 'Restaurant'}! Earn $${data.fee || '3.50'}`,
        timestamp: Date.now()
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinRoom = (roomName) => {
    if (socket && !joinedRoomsRef.current.has(roomName)) {
      socket.emit('join', roomName);
      joinedRoomsRef.current.add(roomName);
    }
  };

  const leaveRoom = (roomName) => {
    if (socket && joinedRoomsRef.current.has(roomName)) {
      socket.emit('leave', roomName);
      joinedRoomsRef.current.delete(roomName);
    }
  };

  const clearAlert = () => {
    setIncomingAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        incomingAlert,
        clearAlert,
        joinRoom,
        leaveRoom
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
