import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { sound } from '../utils/audio';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const registeredRooms = useRef(new Set());

  useEffect(() => {
    // Connect to backend Socket.io
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Connected to Foodie Central Socket server:', socketInstance.id);
      setIsConnected(true);

      // Re-join any previously registered rooms
      registeredRooms.current.forEach((room) => {
        socketInstance.emit('join', room);
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Socket server');
      setIsConnected(false);
    });

    // Global order status change listener
    socketInstance.on('order:status_changed', (data) => {
      console.log('📡 [order:status_changed]:', data);
      setLastEvent({ type: 'order:status_changed', data, timestamp: Date.now() });
      sound.playSuccessChime();
    });

    // New order alert for kitchen / admin
    socketInstance.on('order:created', (data) => {
      console.log('📡 [order:created]:', data);
      setLastEvent({ type: 'order:created', data, timestamp: Date.now() });
      sound.playKitchenAlert();
    });

    // Delivery assigned
    socketInstance.on('delivery:assigned', (data) => {
      console.log('📡 [delivery:assigned]:', data);
      setLastEvent({ type: 'delivery:assigned', data, timestamp: Date.now() });
    });

    // Delivery GPS location update
    socketInstance.on('delivery:location_update', (data) => {
      setLastEvent({ type: 'delivery:location_update', data, timestamp: Date.now() });
    });

    // Delivery task ready for driver pool
    socketInstance.on('delivery:task_ready', (data) => {
      console.log('📡 [delivery:task_ready]:', data);
      setLastEvent({ type: 'delivery:task_ready', data, timestamp: Date.now() });
      sound.playKitchenAlert();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Join user role room whenever user changes
  useEffect(() => {
    if (!socket || !user) return;

    if (user.role === 'customer') {
      const room = `customer_${user.id}`;
      socket.emit('join', room);
      registeredRooms.current.add(room);
    } else if (user.role === 'restaurant') {
      // Join general restaurant updates
      const room = 'restaurant_room';
      socket.emit('join', room);
      registeredRooms.current.add(room);
    } else if (user.role === 'admin') {
      const room = 'admin_room';
      socket.emit('join', room);
      registeredRooms.current.add(room);
    } else if (user.role === 'driver') {
      const room = 'driver_pool';
      socket.emit('join', room);
      registeredRooms.current.add(room);
    }
  }, [socket, user]);

  const joinRoom = (roomName) => {
    if (socket && roomName) {
      socket.emit('join', roomName);
      registeredRooms.current.add(roomName);
    }
  };

  const leaveRoom = (roomName) => {
    if (socket && roomName) {
      socket.emit('leave', roomName);
      registeredRooms.current.delete(roomName);
    }
  };

  const subscribeToOrder = (orderId) => {
    if (!orderId) return;
    joinRoom(`order_${orderId}`);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastEvent,
        joinRoom,
        leaveRoom,
        subscribeToOrder
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
