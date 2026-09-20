import api from './axiosInstance';
import type {
  Asignacion,
  EstudianteResumen,
  RegistroEmocional,
  EstadisticasEmocionales,
  PerfilEstudiante,
  ResumenEstudiante,
  EvaluacionHistorial,
  ActividadHistorial,
  EncuestaRespuestaHistorial,
  EncuestaInstitucional,
} from '../types';

export const pacientesApi = {
  getMisPacientes: async (): Promise<EstudianteResumen[]> => {
    const { data } = await api.get('/api/asignaciones/psicologo/mis-pacientes');
    const asignaciones: Asignacion[] = data.data ?? data;

    return Promise.all(asignaciones.map(async (asignacion) => {
      const resumen = await pacientesApi.getResumen(asignacion.estudiante_id);
      return {
        id: resumen.perfil.id,
        nombres: resumen.perfil.nombres,
        apellidos: resumen.perfil.apellidos,
        ultimo_semaforo: resumen.ultima_evaluacion?.estado_semaforo ?? null,
        fecha_ultima_actividad:
          resumen.ultima_evaluacion?.fecha ?? asignacion.procesado_en,
      };
    }));
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

  getEncuestaInstitucional: async (id: number): Promise<EncuestaInstitucional> => {
    const { data } = await api.get(`/api/encuestas/${id}`);
    return data.data ?? data;
  },
};
