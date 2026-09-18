import api from './axiosInstance';
import type { Chat, Mensaje } from '../types';

export const chatApi = {
  /**
   * Busca un chat activo con el estudiante dado (no-IA).
   * Si no existe, lo crea via POST /api/chats con { estudianteId }.
   * Usa únicamente los endpoints funcionales del backend:
   *   GET  /api/chats
   *   POST /api/chats
   */
  abrirChat: async (estudianteId: number): Promise<Chat> => {
    const { data: listaRaw } = await api.get('/api/chats');
    const lista: Chat[] = listaRaw.data ?? listaRaw;

    // Buscar un chat activo con ese estudiante que no sea IA
    const existente = lista.find(
      (c) => c.estudiante_id === estudianteId && c.is_active && !c.isSendByAi
    );
    if (existente) return existente;

    // No existe → crear. Enviamos ambas variantes por compatibilidad
    // con el backend (camelCase y snake_case)
    const { data: nuevoRaw } = await api.post('/api/chats', {
      estudianteId,
      estudiante_id: estudianteId,
    });
    return nuevoRaw.data ?? nuevoRaw;
  },

  getChats: async (active?: boolean): Promise<Chat[]> => {
    const params = active !== undefined ? `?active=${active}` : '';
    const { data } = await api.get(`/api/chats${params}`);
    return data.data ?? data;
  },

  getChatById: async (chatId: number): Promise<Chat> => {
    const { data } = await api.get(`/api/chats/${chatId}`);
    return data.data ?? data;
  },

  getMensajes: async (chatId: number): Promise<Mensaje[]> => {
    const { data } = await api.get(`/api/chats/${chatId}/mensajes`);
    return data.data ?? data;
  },

  sendMensaje: async (chatId: number, mensaje: string): Promise<Mensaje> => {
    const { data } = await api.post(`/api/chats/${chatId}/mensajes`, { mensaje });
    return data.data ?? data;
  },
};