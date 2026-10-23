import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, Eye, Library, Pencil, Plus, Power, Search, Trash2 } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Button, Badge, Input, Select } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { Ova, OvaTipoActividad } from '../../../types';
import { OvaFormModal } from '../components/OvaFormModal';
import { useEntranceRef } from '../../../hooks/useEntrance';
import { FUENTES, TIPOS, etiqueta } from '../constants';

export default function OvasPage() {
  const navigate = useNavigate();
  const [ovas, setOvas] = useState<Ova[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accionError, setAccionError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<OvaTipoActividad | ''>('');
  const [estado, setEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  const [formAbierto, setFormAbierto] = useState(false);
  const [ovaEditando, setOvaEditando] = useState<Ova | null>(null);
  const ref = useEntranceRef<HTMLDivElement>({ ready: !loading && !error });

  // La busqueda por titulo espera a que el usuario deje de escribir.
  useEffect(() => {
    const t = setTimeout(cargar, 300);
    return () => clearTimeout(t);
  }, [busqueda, tipo, estado]);

  async function cargar() {
    try {
      setLoading(true);
      setError('');
      setOvas(
        await ovaApi.listar({
          q: busqueda,
          tipo,
          activo: estado === 'todos' ? undefined : estado === 'activos',
        }),
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los OVAs');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(ova: Ova) {
    setProcessingId(ova.id);
    setAccionError('');
    try {
      const actualizado = await ovaApi.cambiarEstado(ova.id, !ova.is_active);
      setOvas((prev) =>
        prev.map((o) => (o.id === ova.id ? { ...o, is_active: actualizado.is_active ?? !ova.is_active } : o)),
      );
    } catch (err: any) {
      setAccionError(err.response?.data?.message || 'Error al cambiar el estado');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleEliminar(ova: Ova) {
    if (!window.confirm(`¿Eliminar el OVA "${ova.titulo}"? Las asignaciones existentes se conservan.`)) return;
    setProcessingId(ova.id);
    setAccionError('');
    try {
      await ovaApi.eliminar(ova.id);
      setOvas((prev) => prev.filter((o) => o.id !== ova.id));
    } catch (err: any) {
      setAccionError(err.response?.data?.message || 'Error al eliminar el OVA');
    } finally {
      setProcessingId(null);
    }
  }

  function abrirNuevo() {
    setOvaEditando(null);
    setFormAbierto(true);
  }

  function abrirEdicion(ova: Ova) {
    setOvaEditando(ova);
    setFormAbierto(true);
  }

  function handleGuardado() {
    setFormAbierto(false);
    cargar();
  }

  return (
    <div ref={ref}>
      <Header
        title="OVAs"
        subtitle="Catalogo de objetos virtuales de aprendizaje y reglas de asignacion"
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/ovas/efectividad')}>
              <BarChart3 size={18} />
              Efectividad
            </Button>
            <Button onClick={abrirNuevo}>
              <Plus size={18} />
              Nuevo OVA
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por titulo"
            className="pl-9"
          />
        </div>
        <Select
          aria-label="Filtrar por tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as OvaTipoActividad | '')}
        >
          <option value="">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
        <Select
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </Select>
      </div>

      {accionError && <p className="text-sm text-coral mb-4">{accionError}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={cargar} />
      ) : ovas.length === 0 ? (
        <EmptyState
          icon={<Library size={48} />}
          title="No hay OVAs"
          description="Crea el primero o ajusta los filtros de busqueda."
        />
      ) : (
        <div className="space-y-3">
          {ovas.map((ova) => (
            <Card key={ova.id} data-enter padding="sm" className="transition-shadow duration-200 hover:shadow-card-hover">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-text-primary truncate">{ova.titulo}</p>
                    <Badge variant={ova.is_active ? 'verde' : 'gray'}>
                      {ova.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  {ova.descripcion && (
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{ova.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
                    <Badge variant="primary">{etiqueta(ova.tipo_actividad)}</Badge>
                    <span>{FUENTES.find((f) => f.value === ova.storage_source)?.label}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {ova.duracion_minutos} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/ovas/${ova.id}`)}>
                    <Eye size={16} />
                    Detalle
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => abrirEdicion(ova)} aria-label="Editar OVA">
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(ova)}
                    disabled={processingId === ova.id}
                    aria-label={ova.is_active ? 'Desactivar OVA' : 'Activar OVA'}
                    title={ova.is_active ? 'Desactivar' : 'Activar'}
                  >
                    <Power size={16} className={ova.is_active ? 'text-semaforo-verde' : 'text-text-muted'} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEliminar(ova)}
                    disabled={processingId === ova.id}
                    className="text-coral hover:bg-coral-light"
                    aria-label="Eliminar OVA"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <OvaFormModal
        isOpen={formAbierto}
        ova={ovaEditando}
        onClose={() => setFormAbierto(false)}
        onSaved={handleGuardado}
      />
    </div>
  );
}
