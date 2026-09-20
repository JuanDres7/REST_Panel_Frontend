import { useEffect, useState } from 'react';
import { Card, Badge } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { pacientesApi } from '../../../api';

interface RegistrosEmocionalProps {
  pacienteId: number;
}

export function RegistrosEmocional({ pacienteId }: RegistrosEmocionalProps) {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pacienteId) {
      loadRegistros();
    }
  }, [pacienteId]);

  async function loadRegistros() {
    try {
      setLoading(true);
      const data = await pacientesApi.getRegistroEmocional(pacienteId);
      setRegistros(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar registros emocionales');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadRegistros} />;

  return (
    <Card className="mt-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Registro Emocional</h3>
      {registros.length === 0 ? (
        <EmptyState title="Sin registros" description="El paciente no ha completado registros emocionales recientes." />
      ) : (
        <div className="space-y-3">
          {registros.map((reg, index) => (
            <div key={reg.id || index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div>
                <p className="font-medium text-text-primary capitalize">{reg.categoria}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(reg.created_at || reg.fecha).toLocaleDateString('es-CO')}
                </p>
              </div>
              <Badge variant="verde">Puntaje: {reg.puntaje ?? reg.valor}/4</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RegistrosEmocional;