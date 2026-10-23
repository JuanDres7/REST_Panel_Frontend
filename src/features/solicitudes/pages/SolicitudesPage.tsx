import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Button, Badge } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { asignacionesApi } from '../../../api';
import type { SolicitudConEstudiante } from '../../../types';
import { useEntranceRef } from '../../../hooks/useEntrance';

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudConEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const ref = useEntranceRef<HTMLDivElement>({ ready: !loading && !error });

  useEffect(() => { loadSolicitudes(); }, []);

  async function loadSolicitudes() {
    try {
      setLoading(true);
      const data = await asignacionesApi.getSolicitudesPendientes();
      setSolicitudes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }

  async function handleAprobar(id: number) {
    setProcessingId(id);
    try {
      await asignacionesApi.aprobar(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al aprobar');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRechazar(id: number) {
    setProcessingId(id);
    try {
      await asignacionesApi.rechazar(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al rechazar');
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadSolicitudes} />;

  return (
    <div ref={ref}>
      <Header title="Solicitudes" subtitle="Solicitudes pendientes de revision" />

      {solicitudes.length === 0 ? (
        <EmptyState
          icon={<User size={48} />}
          title="No hay solicitudes pendientes"
          description="Las nuevas solicitudes de estudiantes apareceran aqui."
        />
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud) => (
            <Card
              key={solicitud.id}
              data-enter
              className="transition-shadow duration-200 hover:shadow-card-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light">
                    <User className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {solicitud.estudiante
                        ? `${solicitud.estudiante.nombres} ${solicitud.estudiante.apellidos}`
                        : `Estudiante #${solicitud.estudiante_id}`}
                    </p>
                    {solicitud.estudiante?.correo && (
                      <p className="text-sm text-text-secondary">{solicitud.estudiante.correo}</p>
                    )}
                    <p className="mt-1 text-sm text-text-muted">
                      Solicitud #{solicitud.id} · Estado: {solicitud.estado}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      {solicitud.mensaje?.trim()
                        ? `Mensaje: ${solicitud.mensaje}`
                        : 'El estudiante no agrego un mensaje (dato opcional).'}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Enviada: {new Date(solicitud.solicitado_en).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="amarillo">Pendiente</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAprobar(solicitud.id)}
                    disabled={processingId === solicitud.id}
                    className="text-semaforo-verde-ink hover:bg-semaforo-verde-soft"
                  >
                    <CheckCircle size={18} />
                    Aceptar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRechazar(solicitud.id)}
                    disabled={processingId === solicitud.id}
                    className="text-coral hover:bg-coral-light"
                  >
                    <XCircle size={18} />
                    Rechazar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
