import { useEffect, useCallback, useRef, useState } from 'react';
import { createSocket } from '../api/socket';
import type { SocketMessage, TypingPayload, SocketConnectionStatus } from '../types';

export function useChatSocket(chatId: number | null, token: string) {
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const messageListenersRef = useRef<((msg: SocketMessage) => void)[]>([]);
  const typingListenersRef = useRef<((payload: TypingPayload) => void)[]>([]);
  const [status, setStatus] = useState<SocketConnectionStatus>(chatId && token ? 'connecting' : 'disconnected');

  useEffect(() => {
    if (!chatId || !token) {
      return;
    }

    setStatus('connecting');
    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      // El transporte ya conectó, pero según el manual del backend hay que
      // esperar el evento 'authenticated' (JWT verificado) antes de unirse a la sala.
    });

    socket.on('authenticated', () => {
      setStatus('connected');
      socket.emit('join_chat', chatId);
    });

    socket.on('joined_chat', () => {
      setStatus('connected');
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setStatus('error');
    });

    socket.on('error', () => {
      setStatus('error');
    });

    socket.on('new_message', (msg: SocketMessage) => {
      messageListenersRef.current.forEach((cb) => cb(msg));
    });

    socket.on('user_typing', (payload: TypingPayload) => {
      typingListenersRef.current.forEach((cb) => cb(payload));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setStatus('disconnected');
    };
  }, [chatId, token]);

  const sendMessage = useCallback((mensaje: string) => {
    if (!chatId || socketRef.current?.connected !== true) return false;
    socketRef.current.emit('chat_message', { chatId, mensaje });
    return true;
  }, [chatId]);

  const onNewMessage = useCallback((callback: (msg: SocketMessage) => void) => {
    messageListenersRef.current.push(callback);
    return () => {
      messageListenersRef.current = messageListenersRef.current.filter((cb) => cb !== callback);
    };
  }, []);

  const onTyping = useCallback((callback: (payload: TypingPayload) => void) => {
    typingListenersRef.current.push(callback);
    return () => {
      typingListenersRef.current = typingListenersRef.current.filter((cb) => cb !== callback);
    };
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!chatId || socketRef.current?.connected !== true) return;
    socketRef.current.emit('typing', { chatId, isTyping });
  }, [chatId]);

  return { status, sendMessage, onNewMessage, onTyping, sendTyping };
}