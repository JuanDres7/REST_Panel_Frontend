import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Card, Badge, Button, Input, Select, Modal } from '../../../components/ui';
import { EmptyState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { OvaDimension, OvaNivel, OvaRegla } from '../../../types';
import { semaforoVariant } from '../../pacientes/components/nivelSemaforo';
import { DIMENSIONES, NIVELES, capitalizar, etiqueta } from '../constants';

interface ReglasPanelProps {
  ovaId: number;
  reglas: OvaRegla[];
  onChange: (reglas: OvaRegla[]) => void;
}

export function ReglasPanel({ ovaId, reglas, onChange }: ReglasPanelProps) {
  const [editando, setEditando] = useState<OvaRegla | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [dimension, setDimension] = useState<OvaDimension | ''>('');
  const [nivel, setNivel] = useState<OvaNivel | ''>('');
  const [prioridad, setPrioridad] = useState('0');
  const [activa, setActiva] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errorLista, setErrorLista] = useState('');

  function abrirNueva() {
    setEditando(null);
    setDimension('');
    setNivel('');
    setPrioridad('0');
    setActiva(true);
    setError('');
    setAbierto(true);
  }

  function abrirEdicion(regla: OvaRegla) {
    setEditando(regla);
    setDimension(regla.dimension ?? '');
    setNivel(regla.nivel ?? '');
    setPrioridad(String(regla.prioridad));
    setActiva(regla.is_active);
    setError('');
    setAbierto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // El backend solo exige este criterio al crear; en el panel lo exigimos tambien al editar
    // para no dejar reglas que nunca coinciden.
    if (!dimension && !nivel) {
      setError('Define al menos una dimension o un nivel de semaforo');
      return;
    }
    const valor = Number(prioridad);
    if (!Number.isInteger(valor) || valor < 0 || valor > 100) {
      setError('La prioridad debe ser un entero entre 0 y 100');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      dimension: dimension || null,
      nivel: nivel || null,
      prioridad: valor,
      is_active: activa,
    };
    try {
      if (editando) {
        const actualizada = await ovaApi.actualizarRegla(editando.id, payload);
        onChange(reglas.map((r) => (r.id === actualizada.id ? actualizada : r)));
      } else {
        const creada = await ovaApi.crearRegla(ovaId, payload);
        onChange([...reglas, creada]);
      }
      setAbierto(false);
    } catch (err: any) {
      setError(
        err.response?.status === 409
          ? 'Ya existe una regla con esa dimension y nivel para este OVA'
          : err.response?.data?.message || 'Error al guardar la regla',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(regla: OvaRegla) {
    if (!window.confirm('¿Eliminar esta regla?')) return;
    setErrorLista('');
    try {
      await ovaApi.eliminarRegla(regla.id);
      onChange(reglas.filter((r) => r.id !== regla.id));
    } catch (err: any) {
      setErrorLista(err.response?.data?.message || 'Error al eliminar la regla');
    }
  }

  const ordenadas = [...reglas].sort((a, b) => b.prioridad - a.prioridad);

  return (
    <Card data-enter>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-text-primary">Reglas de asignacion</h3>
          <p className="text-xs text-text-muted mt-1">
            Se asigna el OVA al estudiante cuando su evaluacion coincide con alguna regla activa.
          </p>
        </div>
        <Button size="sm" onClick={abrirNueva}>
          <Plus size={16} />
          Nueva regla
        </Button>
      </div>

      {errorLista && <p className="text-sm text-coral mb-3">{errorLista}</p>}

      {ordenadas.length === 0 ? (
        <EmptyState
          title="Sin reglas"
          description="Sin reglas activas este OVA no se asignara automaticamente."
        />
      ) : (
        <ul className="divide-y divide-line">
          {ordenadas.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3 flex-wrap">
              <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-text-primary">
                  {etiqueta(r.dimension, 'Cualquier dimension')}
                </span>
                {r.nivel ? (
                  <Badge variant={semaforoVariant(r.nivel)}>{capitalizar(r.nivel)}</Badge>
                ) : (
                  <Badge variant="gray">Cualquier nivel</Badge>
                )}
                <span className="text-xs text-text-muted">Prioridad {r.prioridad}</span>
                {!r.is_active && <Badge variant="gray">Inactiva</Badge>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => abrirEdicion(r)} aria-label="Editar regla">
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEliminar(r)}
                className="text-coral hover:bg-coral-light"
                aria-label="Eliminar regla"
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={abierto} onClose={() => setAbierto(false)} title={editando ? 'Editar regla' : 'Nueva regla'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Dimension"
            value={dimension}
            onChange={(e) => setDimension(e.target.value as OvaDimension | '')}
          >
            <option value="">Cualquiera</option>
            {DIMENSIONES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </Select>
          <div className="flex flex-col gap-1.5">
            <Select
              label="Nivel de semaforo"
              value={nivel}
              onChange={(e) => setNivel(e.target.value as OvaNivel | '')}
            >
              <option value="">Cualquiera</option>
              {NIVELES.map((n) => (
                <option key={n} value={n}>{capitalizar(n)}</option>
              ))}
            </Select>
            <p className="text-xs text-text-muted">
              Solo dimension: coincide cuando esa dimension esta en amarillo o rojo.
              Solo nivel: coincide con el semaforo global de la evaluacion.
            </p>
          </div>
          <Input
            label="Prioridad (0-100)"
            type="number"
            min={0}
            max={100}
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
            Regla activa
          </label>

          {error && <p className="text-sm text-coral">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAbierto(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
