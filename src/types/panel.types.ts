export type NivelSemaforo = 'verde' | 'amarillo' | 'rojo';

export interface PerfilEstudiante {
  id: number;
  nombres: string;
  apellidos: string;
  ciudad: string | null;
  semestre_actual: string | null;
  edad: number | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  streak_count: number;
  streak_goal_days: number;
  streak_last_date: string | null;
  fecha_registro: string;
  is_active: boolean;
}

export interface DimensionSemaforo {
  id: number;
  dimension: string;
  puntaje: number;
  nivel: string;
}

export interface UltimaEvaluacion {
  id: number;
  fecha: string;
  puntaje_total: number | null;
  estado_semaforo: string | null;
  subcategoria_principal: string | null;
  observaciones: string | null;
  dimensiones: DimensionSemaforo[];
}

export interface ActividadVigente {
  id: number;
  vencimiento: string;
  observaciones: string | null;
  opcion: {
    id: number;
    nombre: string;
    url_imagen: string;
    descripcion: string | null;
  } | null;
}

export interface ResumenEstudiante {
  perfil: PerfilEstudiante;
  ultima_evaluacion: UltimaEvaluacion | null;
  actividades_vigentes: ActividadVigente[];
}

export interface EvaluacionHistorial {
  id: number;
  fecha: string;
  puntaje_total: number | null;
  estado_semaforo: string | null;
  subcategoria_principal: string | null;
  observaciones: string | null;
  dimensiones: DimensionSemaforo[];
}

export interface ActividadHistorial {
  id: number;
  fecha: string;
  vencimiento: string;
  vencida: boolean;
  observaciones: string | null;
  opcion: {
    id: number;
    nombre: string;
    url_imagen: string;
    descripcion: string | null;
  } | null;
}

export interface EncuestaRespuestaHistorial {
  id: number;
  fecha: string;
  respuesta: string | null;
  encuesta: {
    id: number;
    codigo: string;
    titulo: string;
  } | null;
}