import type { DimensionSemaforo } from '../../../types';
import { Badge } from '../../../components/ui';
import { semaforoBarClass, semaforoVariant } from './nivelSemaforo';

const DIMENSION_LABELS: Record<string, string> = {
  ansiedad: 'Ansiedad',
  estres_academico: 'Estres academico',
  humor_depresivo: 'Humor depresivo',
  sueno: 'Sueno',
  relaciones_sociales: 'Relaciones sociales',
  autoestima_autocuidado: 'Autoestima y autocuidado',
  energia_motivacion: 'Energia y motivacion',
};

const DIMENSION_ORDER = [
  'ansiedad',
  'estres_academico',
  'humor_depresivo',
  'sueno',
  'relaciones_sociales',
  'autoestima_autocuidado',
  'energia_motivacion',
];

interface DimensionesSemaforoProps {
  dimensiones: DimensionSemaforo[];
}

export function DimensionesSemaforo({ dimensiones }: DimensionesSemaforoProps) {
  if (dimensiones.length === 0) {
    return <p className="text-sm text-text-muted">Sin dimensiones registradas</p>;
  }

  const ordenadas = [...dimensiones].sort((a, b) => {
    const wa = DIMENSION_ORDER.indexOf(a.dimension);
    const wb = DIMENSION_ORDER.indexOf(b.dimension);
    return (wa === -1 ? 99 : wa) - (wb === -1 ? 99 : wb);
  });

  return (
    <div className="space-y-3">
      {ordenadas.map((d) => (
        <div key={d.id}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-text-secondary">{DIMENSION_LABELS[d.dimension] ?? d.dimension}</span>
            <span className="flex items-center gap-2">
              <span className="font-medium text-text-primary">{d.puntaje}</span>
              <Badge variant={semaforoVariant(d.nivel)}>{d.nivel}</Badge>
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className={`h-full rounded-full ${semaforoBarClass(d.nivel)}`}
              style={{ width: `${Math.min(Math.max(d.puntaje, 0), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}