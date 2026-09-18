import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { pacientesApi } from '../../../api';

interface EstadisticasChartProps {
  pacienteId: number;
}

export function EstadisticasChart({ pacienteId }: EstadisticasChartProps) {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pacienteId) {
      loadEstadisticas();
    }
  }, [pacienteId]);

  async function loadEstadisticas() {
    try {
      setLoading(true);
      const data = await pacientesApi.getEstadisticas(pacienteId);
      setEstadisticas(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadEstadisticas} />;

  const items = Array.isArray(estadisticas) ? estadisticas : estadisticas?.puntos || [];

  return (
    <Card className="mt-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Estadísticas Emocionales</h3>
      {items.length === 0 ? (
        <EmptyState title="Sin estadísticas" description="No hay datos suficientes para mostrar métricas agregadas." />
      ) : (
        <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2 bg-surface-secondary rounded-lg">
          {items.map((item: any, idx: number) => {
            const val = item.promedio ?? item.valor ?? 0;
            const heightPercent = Math.min(Math.max((val / 4) * 100, 10), 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-primary rounded-t transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs text-text-muted truncate max-w-[50px]">
                  {item.fecha || item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default EstadisticasChart;