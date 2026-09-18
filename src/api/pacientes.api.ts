import api from './axiosInstance';
import type {
  EstudianteResumen,
  RegistroEmocional,
  EstadisticasEmocionales,
  PerfilEstudiante,
  ResumenEstudiante,
  EvaluacionHistorial,
  ActividadHistorial,
  EncuestaRespuestaHistorial,
} from '../types';

export const pacientesApi = {
  getMisPacientes: async (): Promise<EstudianteResumen[]> => {
    const { data } = await api.get('/api/asignaciones/psicologo/mis-pacientes');
    return data.data ?? data;
  },

  getResumen: async (id: number): Promise<ResumenEstudiante> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/resumen`);
    return data.data ?? data;
  },

  getPerfil: async (id: number): Promise<PerfilEstudiante> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/perfil`);
    return data.data ?? data;
  },

  getEvaluaciones: async (id: number): Promise<EvaluacionHistorial[]> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/evaluaciones`);
    return data.data ?? data;
  },

  getRegistroEmocional: async (id: number): Promise<RegistroEmocional[]> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/registro-emocional`);
    return data.data ?? data;
  },

  getEstadisticas: async (id: number): Promise<EstadisticasEmocionales> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/registro-emocional/estadisticas`);
    return data.data ?? data;
  },

  getActividades: async (id: number): Promise<ActividadHistorial[]> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/actividades`);
    return data.data ?? data;
  },

  getEncuestas: async (id: number): Promise<EncuestaRespuestaHistorial[]> => {
    const { data } = await api.get(`/api/psicologo/pacientes/${id}/encuestas`);
    return data.data ?? data;
  },
};
