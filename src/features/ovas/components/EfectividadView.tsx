import { Card, Badge } from '../../../components/ui';
import type { OvaDesgloseEfectividad, OvaEfectividad } from '../../../types';
import { semaforoVariant } from '../../pacientes/components/nivelSemaforo';
import { capitalizar, etiqueta, formatearNumero } from '../constants';

interface EfectividadViewProps {
  efectividad: OvaEfectividad;
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card data-enter padding="sm" className="transition-shadow duration-200 hover:shadow-card-hover">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </Card>
  );
}

function porcentaje(valor: number | null): string {
  return valor === null || valor === undefined ? '-' : `${formatearNumero(valor, 1)}%`;
}

function DeltaCell({ delta }: { delta: number | null }) {
  if (delta === null || delta === undefined) return <span className="text-text-muted">-</span>;
  // Un puntaje menor es mejor estado: delta negativo = mejoria.
  const n = Number(delta);
  const variant = n < 0 ? 'verde' : n > 0 ? 'rojo' : 'gray';
  return <Badge variant={variant}>{n > 0 ? '+' : ''}{formatearNumero(n, 2)}</Badge>;
}

function Desglose({
  titulo,
  filas,
  campo,
}: {
  titulo: string;
  filas: OvaDesgloseEfectividad[];
  campo: 'dimension' | 'nivel';
}) {
  return (
    <Card data-enter>
      <h3 className="font-semibold text-text-primary mb-4">{titulo}</h3>
      {filas.length === 0 ? (
        <p className="text-sm text-text-muted">Sin datos todavia</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-muted">
                <th className="pb-2 font-medium">{campo === 'dimension' ? 'Dimension' : 'Nivel'}</th>
                <th className="pb-2 font-medium text-right">Asignadas</th>
                <th className="pb-2 font-medium text-right">Completadas</th>
                <th className="pb-2 font-medium text-right">Con mejoria</th>
                <th className="pb-2 font-medium text-right">Delta prom.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filas.map((f) => {
                const clave = f[campo] ?? '';
                const nombre =
                  clave === 'global' ? 'General (sin dimension)'
                    : clave === 'no_especificado' ? 'Sin nivel especifico'
                      : etiqueta(clave, '-');
                return (
                  <tr key={clave}>
                    <td className="py-2">
                      {campo === 'nivel' && semaforoVariant(clave) !== 'gray' ? (
                        <Badge variant={semaforoVariant(clave)}>{capitalizar(clave)}</Badge>
                      ) : (
                        nombre
                      )}
                    </td>
                    <td className="py-2 text-right">{f.total_asignadas}</td>
                    <td className="py-2 text-right">{f.total_completadas}</td>
                    <td className="py-2 text-right">{f.casos_con_mejoria}</td>
                    <td className="py-2 text-right"><DeltaCell delta={f.delta_promedio} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function EfectividadView({ efectividad }: EfectividadViewProps) {
  const r = efectividad.resumen;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Asignadas" value={String(r.total_asignadas)} />
        <Kpi
          label="Adherencia"
          value={porcentaje(r.tasa_adherencia_porcentaje)}
          hint={`${r.total_completadas} completadas · ${r.total_omitidas} omitidas`}
        />
        <Kpi label="Les gusto" value={porcentaje(r.porcentaje_liked)} />
        <Kpi
          label="Rating promedio"
          value={r.rating_promedio === null ? '-' : `${formatearNumero(r.rating_promedio, 1)} / 5`}
        />
        <Kpi
          label="Post-tests"
          value={String(r.evaluaciones_post_test_completadas)}
          hint="Evaluaciones posteriores enlazadas"
        />
        <Kpi
          label="Delta promedio"
          value={formatearNumero(r.delta_promedio, 2)}
          hint="Negativo = mejoria"
        />
        <Kpi label="Casos con mejoria" value={String(r.casos_con_mejoria)} />
        <Kpi label="% de mejoria" value={porcentaje(r.porcentaje_mejoria)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Desglose titulo="Por dimension" filas={efectividad.desglose_por_dimension} campo="dimension" />
        <Desglose titulo="Por nivel de semaforo" filas={efectividad.desglose_por_nivel} campo="nivel" />
      </div>
    </div>
  );
}
