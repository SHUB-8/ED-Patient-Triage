import { io, Socket } from 'socket.io-client';

// Create a socket connection to the backend
let socket: Socket | null = null;

/**
 * Initialize the socket connection
 */
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
    });
    
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server with ID:', socket?.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socket;
};

/**
 * Get the socket instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Listen for queue updates
 */
export const onQueueUpdate = (callback: (data: any) => void): void => {
  if (!socket) {
    initSocket();
  }
  
  socket?.on('queues_updated', callback);
};

/**
 * Remove queue update listener
 */
export const offQueueUpdate = (callback: (data: any) => void): void => {
  socket?.off('queues_updated', callback);
};

/**
 * Listen for bed updates
 */
export const onBedUpdate = (callback: (data: any) => void): void => {
  if (!socket) {
    initSocket();
  }
  
  socket?.on('bed_updated', callback);
};

/**
 * Remove bed update listener
 */
export const offBedUpdate = (callback: (data: any) => void): void => {
  socket?.off('bed_updated', callback);
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};