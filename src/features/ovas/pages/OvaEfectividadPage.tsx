import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { OvaEfectividad } from '../../../types';
import { EfectividadView } from '../components/EfectividadView';
import { useEntranceRef } from '../../../hooks/useEntrance';

export default function OvaEfectividadPage() {
  const navigate = useNavigate();
  const [efectividad, setEfectividad] = useState<OvaEfectividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ref = useEntranceRef<HTMLDivElement>({ ready: !loading && !error && !!efectividad });

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    setError('');
    try {
      setEfectividad(await ovaApi.efectividadGlobal());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la efectividad');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error || !efectividad) return <ErrorState message={error || 'Sin datos'} onRetry={cargar} />;

  return (
    <div ref={ref}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/ovas')}
          className="mt-1.5 cursor-pointer rounded-lg p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label="Volver a OVAs"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <Header
            title="Efectividad de los OVAs"
            subtitle="Resultados agregados de todas las asignaciones"
          />
        </div>
      </div>

      <EfectividadView efectividad={efectividad} />
    </div>
  );
}
