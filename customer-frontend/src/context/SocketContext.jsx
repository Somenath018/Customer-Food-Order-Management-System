import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { soundEngine } from '../utils/audio';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveOrderEvent, setLiveOrderEvent] = useState(null);
  const [driverLocations, setDriverLocations] = useState({});
  const joinedRoomsRef = useRef(new Set());

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('⚡ Customer Socket connected:', newSocket.id);
      setIsConnected(true);

      // Re-join user's customer room
      if (user?.id) {
        const custRoom = `customer_${user.id}`;
        newSocket.emit('join', custRoom);
        joinedRoomsRef.current.add(custRoom);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Customer Socket disconnected');
      setIsConnected(false);
    });

    // Order status progression event
    newSocket.on('order:status_changed', (data) => {
      console.log('🔔 Order status updated via WebSocket:', data);
      if (data.status === 'delivered') {
        soundEngine.playDeliveredFanfare();
      } else {
        soundEngine.playStatusNotification();
      }
      setLiveOrderEvent({
        type: 'status_changed',
        order: data.order,
        status: data.status,
        timestamp: Date.now()
      });
    });

    // Driver assigned event
    newSocket.on('delivery:assigned', (data) => {
      console.log('🛵 Driver assigned via WebSocket:', data);
      soundEngine.playStatusNotification();
      setLiveOrderEvent({
        type: 'driver_assigned',
        orderId: data.orderId,
        driverName: data.driverName,
        delivery: data.delivery,
        timestamp: Date.now()
      });
    });

    // Driver live GPS coordinate ping
    newSocket.on('delivery:location_update', (data) => {
      if (data.orderId && data.lat && data.lng) {
        setDriverLocations(prev => ({
          ...prev,
          [data.orderId]: {
            lat: data.lat,
            lng: data.lng,
            updatedAt: data.updatedAt || new Date().toISOString()
          }
        }));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // When user signs in, join their customer room
  useEffect(() => {
    if (socket && user?.id) {
      const custRoom = `customer_${user.id}`;
      if (!joinedRoomsRef.current.has(custRoom)) {
        socket.emit('join', custRoom);
        joinedRoomsRef.current.add(custRoom);
      }
    }
  }, [socket, user]);

  const joinOrderRoom = (orderId) => {
    if (socket && orderId) {
      const room = `order_${orderId}`;
      if (!joinedRoomsRef.current.has(room)) {
        socket.emit('join', room);
        joinedRoomsRef.current.add(room);
      }
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socket && orderId) {
      const room = `order_${orderId}`;
      if (joinedRoomsRef.current.has(room)) {
        socket.emit('leave', room);
        joinedRoomsRef.current.delete(room);
      }
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        liveOrderEvent,
        driverLocations,
        joinOrderRoom,
        leaveOrderRoom
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
