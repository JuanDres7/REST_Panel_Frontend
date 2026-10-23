export type OvaTipoActividad = 'video' | 'respiracion' | 'ejercicio_practico';
export type OvaStorageSource = 'YOUTUBE' | 'CLOUDFLARE_R2' | 'EXTERNAL_URL';
export type OvaAsignacionEstado = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'DISMISSED';

export type OvaDimension =
  | 'ansiedad'
  | 'estres_academico'
  | 'humor_depresivo'
  | 'sueno'
  | 'relaciones_sociales'
  | 'autoestima_autocuidado'
  | 'energia_motivacion';

export type OvaNivel = 'verde' | 'amarillo' | 'rojo';

export interface RecursoResuelto {
  storage_source: OvaStorageSource;
  original_url: string;
  resolved_url: string;
  video_id?: string;
  watch_url?: string;
  embed_url?: string;
}

export interface OvaRegla {
  id: number;
  ova_id: number;
  creado_por: number | null;
  dimension: OvaDimension | null;
  nivel: OvaNivel | null;
  prioridad: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ova {
  id: number;
  creado_por: number | null;
  titulo: string;
  descripcion: string | null;
  tipo_actividad: OvaTipoActividad;
  duracion_minutos: number;
  storage_source: OvaStorageSource;
  resource_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  recurso_resuelto?: RecursoResuelto;
}

export interface OvaDetalle extends Ova {
  reglas: OvaRegla[];
}

export interface OvaPayload {
  titulo: string;
  descripcion?: string;
  tipo_actividad: OvaTipoActividad;
  duracion_minutos: number;
  storage_source: OvaStorageSource;
  resource_url: string;
  is_active: boolean;
}

export interface OvaFiltros {
  q?: string;
  tipo?: OvaTipoActividad | '';
  activo?: boolean;
}

export interface ReglaPayload {
  dimension?: OvaDimension | null;
  nivel?: OvaNivel | null;
  prioridad: number;
  is_active: boolean;
}

export interface ArchivoSubido {
  message: string;
  storage_source: 'CLOUDFLARE_R2';
  resource_url: string;
  recurso_resuelto: RecursoResuelto;
}

export interface OvaResumenEfectividad {
  total_asignadas: number;
  total_completadas: number;
  total_omitidas: number;
  tasa_adherencia_porcentaje: number | null;
  porcentaje_liked: number | null;
  rating_promedio: number | null;
  evaluaciones_post_test_completadas: number;
  delta_promedio: number | null;
  casos_con_mejoria: number;
  porcentaje_mejoria: number | null;
}

export interface OvaDesgloseEfectividad {
  dimension?: string;
  nivel?: string;
  total_asignadas: number;
  total_completadas: number;
  casos_con_mejoria: number;
  delta_promedio: number | null;
}

export interface OvaEfectividad {
  ova?: Pick<Ova, 'id' | 'titulo' | 'tipo_actividad' | 'storage_source'>;
  resumen: OvaResumenEfectividad;
  desglose_por_dimension: OvaDesgloseEfectividad[];
  desglose_por_nivel: OvaDesgloseEfectividad[];
}

export interface OvaAsignacionPaciente {
  id: number;
  estudiante_id: number;
  ova_id: number;
  regla_id: number | null;
  pre_evaluacion_id: number;
  post_evaluacion_id?: number | null;
  estado: OvaAsignacionEstado;
  matched_dimension: string | null;
  matched_nivel: string | null;
  matched_subcategoria: string | null;
  prioridad: number;
  started_at: string | null;
  completed_at: string | null;
  liked: boolean | null;
  rating: number | null;
  pre_puntaje: number | string | null;
  post_puntaje: number | string | null;
  delta_puntaje: number | string | null;
  pre_estado_semaforo: string | null;
  post_estado_semaforo: string | null;
  created_at: string;
  ova_titulo: string;
  ova_tipo_actividad: OvaTipoActividad;
  ova_duracion_minutos: number;
  ova_storage_source: OvaStorageSource;
  ova_resource_url: string;
  recurso_resuelto?: RecursoResuelto;
}
