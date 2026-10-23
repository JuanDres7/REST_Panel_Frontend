import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Badge, Button } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { pacientesApi } from '../../../api';
import type { EstudianteResumen } from '../../../types';
import { useEntranceRef } from '../../../hooks/useEntrance';
import { capitalizar } from '../../ovas/constants';

const semaforoColors: Record<string, 'verde' | 'amarillo' | 'rojo'> = {
  verde: 'verde',
  amarillo: 'amarillo',
  rojo: 'rojo',
};

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<EstudianteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ref = useEntranceRef<HTMLDivElement>({ ready: !loading && !error });

  useEffect(() => { loadPacientes(); }, []);

  async function loadPacientes() {
    try {
      const data = await pacientesApi.getMisPacientes();
      setPacientes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadPacientes} />;

  return (
    <div ref={ref}>
      <Header title="Pacientes" subtitle="Estudiantes asignados" />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<User size={48} />}
          title="No tienes pacientes asignados"
          description="Los pacientes apareceran aqui cuando aceptes una solicitud."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pacientes.map((p) => (
            <Card
              key={p.id}
              data-enter
              interactive
              onClick={() => navigate(`/pacientes/${p.id}`)}
              className="group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light transition-transform duration-200 group-hover:scale-105">
                  <User className="text-primary" size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text-primary">
                    {p.nombres} {p.apellidos}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {p.ultimo_semaforo && (
                      <Badge variant={semaforoColors[p.ultimo_semaforo] ?? 'gray'}>
                        {capitalizar(p.ultimo_semaforo)}
                      </Badge>
                    )}
                  </div>
                  {p.fecha_ultima_actividad && (
                    <p className="mt-2 text-xs text-text-muted">
                      Ultima actividad: {new Date(p.fecha_ultima_actividad).toLocaleDateString('es-CO')}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chat/${p.id}`);
                  }}
                >
                  <MessageCircle size={16} />
                  Chat
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
