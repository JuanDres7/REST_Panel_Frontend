import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Badge, Button } from '../../../components/ui';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { OvaDetalle, OvaEfectividad, OvaRegla } from '../../../types';
import { OvaFormModal } from '../components/OvaFormModal';
import { RecursoPreview } from '../components/RecursoPreview';
import { ReglasPanel } from '../components/ReglasPanel';
import { EfectividadView } from '../components/EfectividadView';
import { etiqueta } from '../constants';
import { useEntranceRef } from '../../../hooks/useEntrance';

export default function OvaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ovaId = Number(id);

  const [ova, setOva] = useState<OvaDetalle | null>(null);
  const [efectividad, setEfectividad] = useState<OvaEfectividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const ref = useEntranceRef<HTMLDivElement>({ ready: !loading && !error && !!ova });

  useEffect(() => { cargar(); }, [ovaId]);

  async function cargar() {
    setLoading(true);
    setError('');
    try {
      const [detalle, efect] = await Promise.all([
        ovaApi.obtener(ovaId),
        ovaApi.efectividadOva(ovaId),
      ]);
      setOva(detalle);
      setEfectividad(efect);
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? 'OVA no encontrado'
          : err.response?.data?.message || 'Error al cargar el OVA',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReglas(reglas: OvaRegla[]) {
    setOva((prev) => (prev ? { ...prev, reglas } : prev));
  }

  if (loading) return <LoadingSpinner />;
  if (error || !ova) return <ErrorState message={error || 'OVA no encontrado'} onRetry={cargar} />;

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
            title={ova.titulo}
            subtitle={`${etiqueta(ova.tipo_actividad)} · ${ova.duracion_minutos} min`}
            actions={
              <>
                <Badge variant={ova.is_active ? 'verde' : 'gray'}>{ova.is_active ? 'Activo' : 'Inactivo'}</Badge>
                <Button onClick={() => setEditando(true)}>
                  <Pencil size={16} />
                  Editar
                </Button>
              </>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card data-enter>
          <h3 className="font-semibold text-text-primary mb-3">Recurso</h3>
          <RecursoPreview recurso={ova.recurso_resuelto} />
          {ova.descripcion && <p className="text-sm text-text-secondary mt-4">{ova.descripcion}</p>}
          <p className="text-xs text-text-muted mt-3 break-all">
            {etiqueta(ova.storage_source)}: {ova.resource_url}
          </p>
        </Card>

        <ReglasPanel ovaId={ova.id} reglas={ova.reglas} onChange={handleReglas} />
      </div>

      <h3 data-enter className="mb-4 text-lg font-semibold text-text-primary">Efectividad de este OVA</h3>
      {efectividad && <EfectividadView efectividad={efectividad} />}

      <OvaFormModal
        isOpen={editando}
        ova={ova}
        onClose={() => setEditando(false)}
        onSaved={() => {
          setEditando(false);
          cargar();
        }}
      />
    </div>
  );
}
