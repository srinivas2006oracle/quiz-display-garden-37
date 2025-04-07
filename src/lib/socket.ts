
import { io, Socket } from 'socket.io-client';

// The URL of the backend server
export const SOCKET_SERVER_URL = 'http://localhost:5001';

// Create a singleton socket instance
export const socket: Socket = io(SOCKET_SERVER_URL);

// Add global event handlers
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
