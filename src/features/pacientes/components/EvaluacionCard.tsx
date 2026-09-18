import type { EvaluacionHistorial } from '../../../types';
import { Card, Badge } from '../../../components/ui';
import { semaforoVariant } from './nivelSemaforo';
import { DimensionesSemaforo } from './DimensionesSemaforo';

interface EvaluacionCardProps {
  evaluacion: EvaluacionHistorial;
}

export function EvaluacionCard({ evaluacion }: EvaluacionCardProps) {
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <p className="font-semibold text-text-primary">
            {new Date(evaluacion.fecha).toLocaleDateString('es-CO')}
          </p>
          {evaluacion.subcategoria_principal && (
            <p className="text-xs text-text-muted">{evaluacion.subcategoria_principal}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Puntaje:</span>
          <span className="font-medium text-text-primary">{evaluacion.puntaje_total ?? '-'}</span>
          <Badge variant={semaforoVariant(evaluacion.estado_semaforo)}>
            {evaluacion.estado_semaforo}
          </Badge>
        </div>
      </div>
      {evaluacion.observaciones && (
        <p className="text-sm text-text-secondary mb-3">{evaluacion.observaciones}</p>
      )}
      <DimensionesSemaforo dimensiones={evaluacion.dimensiones} />
    </Card>
  );
}