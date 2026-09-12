import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Join room event (e.g. 'order_123', 'restaurant_rest_01', 'driver_pool', 'admin_room', 'customer_user_1')
    socket.on('join', (room) => {
      socket.join(room);
      console.log(`📡 Socket ${socket.id} joined room: ${room}`);
      socket.emit('joined', { room, message: `Successfully joined room ${room}` });
    });

    socket.on('leave', (room) => {
      socket.leave(room);
      console.log(`📡 Socket ${socket.id} left room: ${room}`);
    });

    // Driver live location ping from client
    socket.on('driver:location_ping', ({ orderId, lat, lng }) => {
      if (orderId) {
        io.to(`order_${orderId}`).emit('delivery:location_update', {
          orderId,
          lat,
          lng,
          updatedAt: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet.');
  }
  return io;
};

export const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

export const emitGlobal = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
