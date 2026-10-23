import type {
  OvaAsignacionEstado,
  OvaDimension,
  OvaNivel,
  OvaStorageSource,
  OvaTipoActividad,
} from '../../types';

export const TIPOS: { value: OvaTipoActividad; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'respiracion', label: 'Respiracion' },
  { value: 'ejercicio_practico', label: 'Ejercicio practico' },
];

export const FUENTES: { value: OvaStorageSource; label: string }[] = [
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'CLOUDFLARE_R2', label: 'Archivo' },
  { value: 'EXTERNAL_URL', label: 'URL externa' },
];

export const DIMENSIONES: { value: OvaDimension; label: string }[] = [
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'estres_academico', label: 'Estres academico' },
  { value: 'humor_depresivo', label: 'Humor depresivo' },
  { value: 'sueno', label: 'Sueno' },
  { value: 'relaciones_sociales', label: 'Relaciones sociales' },
  { value: 'autoestima_autocuidado', label: 'Autoestima y autocuidado' },
  { value: 'energia_motivacion', label: 'Energia y motivacion' },
];

export const NIVELES: OvaNivel[] = ['verde', 'amarillo', 'rojo'];

export const ESTADOS_ASIGNACION: Record<
  OvaAsignacionEstado,
  { label: string; variant: 'gray' | 'primary' | 'verde' | 'amarillo' | 'coral' }
> = {
  PENDING: { label: 'Pendiente', variant: 'amarillo' },
  IN_PROGRESS: { label: 'En curso', variant: 'primary' },
  COMPLETED: { label: 'Completada', variant: 'verde' },
  SKIPPED: { label: 'Omitida', variant: 'gray' },
  DISMISSED: { label: 'Descartada', variant: 'coral' },
};

const etiquetas = new Map<string, string>([
  ...TIPOS.map((t) => [t.value, t.label] as [string, string]),
  ...FUENTES.map((f) => [f.value, f.label] as [string, string]),
  ...DIMENSIONES.map((d) => [d.value, d.label] as [string, string]),
]);

export function etiqueta(valor: string | null | undefined, vacio = 'Cualquiera'): string {
  if (!valor) return vacio;
  return etiquetas.get(valor) ?? valor;
}

export function capitalizar(valor: string | null | undefined): string {
  if (!valor) return '';
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}

export function formatearNumero(valor: number | string | null | undefined, decimales = 1): string {
  if (valor === null || valor === undefined || valor === '') return '-';
  const n = Number(valor);
  return Number.isFinite(n) ? n.toFixed(decimales) : '-';
}
