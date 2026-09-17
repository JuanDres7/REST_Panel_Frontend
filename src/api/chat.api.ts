import api from './axiosInstance';
import type { Chat, Mensaje } from '../types';

export const chatApi = {
  abrirChat: async (estudianteId: number): Promise<Chat> => {
    const { data } = await api.post(`/api/psicologo/pacientes/${estudianteId}/chat`);
    return data.data ?? data;
  },

  getChatsPaciente: async (estudianteId: number): Promise<Chat[]> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${estudianteId}/chats`);
    return data.data ?? data;
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