import api from './axiosInstance';
import type {
  Ova,
  OvaDetalle,
  OvaFiltros,
  OvaPayload,
  OvaRegla,
  ReglaPayload,
  ArchivoSubido,
  OvaEfectividad,
  OvaAsignacionPaciente,
} from '../types';

const BASE = '/api/psicologo/ovas';

export const ovaApi = {
  listar: async (filtros: OvaFiltros = {}): Promise<Ova[]> => {
    const params: Record<string, string> = {};
    if (filtros.q?.trim()) params.q = filtros.q.trim();
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.activo !== undefined) params.activo = String(filtros.activo);
    const { data } = await api.get(BASE, { params });
    return data.ovas ?? data.data?.ovas ?? [];
  },

  obtener: async (id: number): Promise<OvaDetalle> => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data.data ?? data;
  },

  crear: async (payload: OvaPayload): Promise<Ova> => {
    const { data } = await api.post(BASE, payload);
    return data.ova ?? data.data ?? data;
  },

  actualizar: async (id: number, payload: Partial<OvaPayload>): Promise<Ova> => {
    const { data } = await api.patch(`${BASE}/${id}`, payload);
    return data.ova ?? data.data ?? data;
  },

  cambiarEstado: async (id: number, is_active: boolean): Promise<Ova> => {
    const { data } = await api.patch(`${BASE}/${id}/estado`, { is_active });
    return data.ova ?? data.data ?? data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },

  subirArchivo: async (archivo: File): Promise<ArchivoSubido> => {
    const form = new FormData();
    form.append('archivo', archivo);
    const { data } = await api.post(`${BASE}/archivos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  listarReglas: async (ovaId: number): Promise<OvaRegla[]> => {
    const { data } = await api.get(`${BASE}/${ovaId}/reglas`);
    return data.reglas ?? data.data?.reglas ?? [];
  },

  crearRegla: async (ovaId: number, payload: ReglaPayload): Promise<OvaRegla> => {
    const { data } = await api.post(`${BASE}/${ovaId}/reglas`, payload);
    return data.regla ?? data.data ?? data;
  },

  actualizarRegla: async (reglaId: number, payload: Partial<ReglaPayload>): Promise<OvaRegla> => {
    const { data } = await api.patch(`${BASE}/reglas/${reglaId}`, payload);
    return data.regla ?? data.data ?? data;
  },

  eliminarRegla: async (reglaId: number): Promise<void> => {
    await api.delete(`${BASE}/reglas/${reglaId}`);
  },

  efectividadGlobal: async (): Promise<OvaEfectividad> => {
    const { data } = await api.get(`${BASE}/efectividad`);
    return data.data ?? data;
  },

  efectividadOva: async (id: number): Promise<OvaEfectividad> => {
    const { data } = await api.get(`${BASE}/${id}/efectividad`);
    return data.data ?? data;
  },

  getAsignacionesPaciente: async (estudianteId: number): Promise<OvaAsignacionPaciente[]> => {
    const { data } = await api.get(`${BASE}/pacientes/${estudianteId}/ovas`);
    return data.asignaciones ?? data.data?.asignaciones ?? [];
  },
};
