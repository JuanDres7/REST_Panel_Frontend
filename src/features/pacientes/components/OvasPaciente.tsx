import { useEffect, useState } from 'react';
import { Library, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Card, Badge } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { OvaAsignacionPaciente } from '../../../types';
import { ESTADOS_ASIGNACION, capitalizar, etiqueta, formatearNumero } from '../../ovas/constants';
import { semaforoVariant } from './nivelSemaforo';

interface OvasPacienteProps {
  pacienteId: number;
}

function formatearFecha(fecha: string | null): string {
  return fecha ? new Date(fecha).toLocaleDateString('es-CO') : '-';
}

export function OvasPaciente({ pacienteId }: OvasPacienteProps) {
  const [asignaciones, setAsignaciones] = useState<OvaAsignacionPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { cargar(); }, [pacienteId]);

  async function cargar() {
    setLoading(true);
    setError('');
    try {
      setAsignaciones(await ovaApi.getAsignacionesPaciente(pacienteId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los OVAs del paciente');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={cargar} />;

  if (asignaciones.length === 0) {
    return (
      <EmptyState
        icon={<Library size={48} />}
        title="Sin OVAs asignados"
        description="Los OVAs se asignan automaticamente segun el resultado de las evaluaciones del estudiante."
      />
    );
  }

  return (
    <div className="space-y-3">
      {asignaciones.map((a) => {
        const estado = ESTADOS_ASIGNACION[a.estado] ?? { label: a.estado, variant: 'gray' as const };
        const delta = a.delta_puntaje === null ? null : Number(a.delta_puntaje);
        return (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-semibold text-text-primary">{a.ova_titulo}</p>
                <p className="text-xs text-text-muted mt-1">
                  {etiqueta(a.ova_tipo_actividad)} · {a.ova_duracion_minutos} min · Asignado:{' '}
                  {formatearFecha(a.created_at)}
                </p>
              </div>
              <Badge variant={estado.variant}>{estado.label}</Badge>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap text-sm">
              <span className="text-text-secondary">Motivo:</span>
              <span className="font-medium">{etiqueta(a.matched_dimension, 'Semaforo global')}</span>
              {a.matched_nivel && (
                <Badge variant={semaforoVariant(a.matched_nivel)}>{capitalizar(a.matched_nivel)}</Badge>
              )}
            </div>

            {a.estado === 'COMPLETED' && (
              <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-text-muted">Completada</p>
                  <p className="font-medium">{formatearFecha(a.completed_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Valoracion</p>
                  <p className="font-medium inline-flex items-center gap-1">
                    {a.liked === null ? '-' : a.liked ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
                    {a.rating ? `${a.rating} / 5` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Puntaje pre → post</p>
                  <p className="font-medium">
                    {formatearNumero(a.pre_puntaje, 1)} → {a.post_puntaje != null ? formatearNumero(a.post_puntaje, 1) : 'pendiente'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Cambio</p>
                  {delta === null ? (
                    <p className="font-medium text-text-muted">Sin post-test</p>
                  ) : (
                    <Badge variant={delta < 0 ? 'verde' : delta > 0 ? 'rojo' : 'gray'}>
                      {delta > 0 ? '+' : ''}{formatearNumero(delta, 2)} {delta < 0 ? '(mejoria)' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
