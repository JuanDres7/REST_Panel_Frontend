export type SemaforoVariant = 'verde' | 'amarillo' | 'rojo' | 'gray';

export function semaforoVariant(nivel: string | null | undefined): SemaforoVariant {
  if (nivel === 'verde') return 'verde';
  if (nivel === 'amarillo') return 'amarillo';
  if (nivel === 'rojo') return 'rojo';
  return 'gray';
}

export function semaforoBarClass(nivel: string | null | undefined): string {
  if (nivel === 'verde') return 'bg-semaforo-verde';
  if (nivel === 'amarillo') return 'bg-semaforo-amarillo';
  if (nivel === 'rojo') return 'bg-semaforo-rojo';
  return 'bg-gray-200';
}