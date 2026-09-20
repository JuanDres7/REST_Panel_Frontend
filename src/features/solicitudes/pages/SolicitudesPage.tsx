import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Button, Badge } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { asignacionesApi } from '../../../api';
import type { SolicitudConEstudiante } from '../../../types';

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudConEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

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
    <div>
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
            <Card key={solicitud.id}>
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
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
                    <p className="text-sm text-text-muted mt-1">
                      Solicitud #{solicitud.id} · Estado: {solicitud.estado}
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                      {solicitud.mensaje?.trim()
                        ? `Mensaje: ${solicitud.mensaje}`
                        : 'El estudiante no agrego un mensaje (dato opcional).'}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
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
                    className="text-semaforo-verde hover:bg-green-50"
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
