import { io, Socket } from 'socket.io-client';
import { API_URL } from './apiConfig';

export const createSocket = (token: string): Socket => {
  return io(API_URL, {
    auth: { token },
    transports: ['websocket'],
  });
};
