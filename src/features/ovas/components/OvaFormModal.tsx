import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { Modal, Input, Select, Textarea, Button } from '../../../components/ui';
import { ovaApi } from '../../../api';
import type { Ova, OvaPayload, OvaStorageSource, OvaTipoActividad } from '../../../types';
import { FUENTES, TIPOS } from '../constants';

interface OvaFormModalProps {
  isOpen: boolean;
  ova?: Ova | null;
  onClose: () => void;
  onSaved: (ova: Ova) => void;
}

const MAX_MB = 80;
const ACCEPT = 'video/mp4,video/webm,video/quicktime,audio/mpeg,audio/mp4,application/pdf,image/jpeg,image/png,image/webp';

interface FormState {
  titulo: string;
  descripcion: string;
  tipo_actividad: OvaTipoActividad;
  duracion_minutos: string;
  storage_source: OvaStorageSource;
  resource_url: string;
  is_active: boolean;
}

function estadoInicial(ova?: Ova | null): FormState {
  return {
    titulo: ova?.titulo ?? '',
    descripcion: ova?.descripcion ?? '',
    tipo_actividad: ova?.tipo_actividad ?? 'video',
    duracion_minutos: String(ova?.duracion_minutos ?? 5),
    storage_source: ova?.storage_source ?? 'YOUTUBE',
    resource_url: ova?.resource_url ?? '',
    is_active: ova?.is_active ?? true,
  };
}

export function OvaFormModal({ isOpen, ova, onClose, onSaved }: OvaFormModalProps) {
  const [form, setForm] = useState<FormState>(estadoInicial(ova));
  const [archivo, setArchivo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(estadoInicial(ova));
      setArchivo(null);
      setError('');
    }
  }, [isOpen, ova]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validar(): string {
    if (form.titulo.trim().length < 3) return 'El titulo debe tener al menos 3 caracteres';
    const duracion = Number(form.duracion_minutos);
    if (!Number.isInteger(duracion) || duracion < 1 || duracion > 180) {
      return 'La duracion debe ser un entero entre 1 y 180 minutos';
    }
    if (form.storage_source === 'CLOUDFLARE_R2') {
      if (!archivo && !form.resource_url) return 'Selecciona un archivo para subir';
      if (archivo && archivo.size > MAX_MB * 1024 * 1024) return `El archivo supera el maximo de ${MAX_MB} MB`;
    } else if (!form.resource_url.trim()) {
      return 'Ingresa la URL del recurso';
    }
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const mensaje = validar();
    if (mensaje) {
      setError(mensaje);
      return;
    }

    setSaving(true);
    setError('');
    try {
      let resourceUrl = form.resource_url.trim();
      if (form.storage_source === 'CLOUDFLARE_R2' && archivo) {
        const subido = await ovaApi.subirArchivo(archivo);
        resourceUrl = subido.resource_url;
      }

      const payload: OvaPayload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        tipo_actividad: form.tipo_actividad,
        duracion_minutos: Number(form.duracion_minutos),
        storage_source: form.storage_source,
        resource_url: resourceUrl,
        is_active: form.is_active,
      };
      const guardado = ova
        ? await ovaApi.actualizar(ova.id, payload)
        : await ovaApi.crear(payload);
      onSaved(guardado);
    } catch (err: any) {
      const status = err.response?.status;
      setError(
        status === 503
          ? 'El almacenamiento de archivos (R2) no esta configurado en el servidor'
          : status === 413
            ? `El archivo supera el maximo de ${MAX_MB} MB`
            : err.response?.data?.message || 'Error al guardar el OVA',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ova ? 'Editar OVA' : 'Nuevo OVA'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Titulo"
          value={form.titulo}
          onChange={(e) => set('titulo', e.target.value)}
          maxLength={255}
        />

        <Textarea
          label="Descripcion"
          value={form.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Tipo"
            value={form.tipo_actividad}
            onChange={(e) => set('tipo_actividad', e.target.value as OvaTipoActividad)}
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
          <Input
            label="Duracion (min)"
            type="number"
            min={1}
            max={180}
            value={form.duracion_minutos}
            onChange={(e) => set('duracion_minutos', e.target.value)}
          />
        </div>

        <Select
          label="Fuente del recurso"
          value={form.storage_source}
          onChange={(e) => {
            set('storage_source', e.target.value as OvaStorageSource);
            set('resource_url', '');
            setArchivo(null);
          }}
        >
          {FUENTES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>

        {form.storage_source === 'CLOUDFLARE_R2' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Archivo (video, audio, PDF o imagen, max. {MAX_MB} MB)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-text-secondary transition-colors hover:border-primary hover:bg-primary-light">
              <Upload size={18} />
              <span className="truncate">
                {archivo?.name ?? (form.resource_url ? `Actual: ${form.resource_url}` : 'Seleccionar archivo')}
              </span>
              <input
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-xs text-text-muted">
              El archivo se sube al guardar. Si cancelas despues de subirlo puede quedar sin usar en el almacenamiento.
            </p>
          </div>
        ) : (
          <Input
            label={form.storage_source === 'YOUTUBE' ? 'URL de YouTube' : 'URL del recurso'}
            value={form.resource_url}
            onChange={(e) => set('resource_url', e.target.value)}
            placeholder="https://"
          />
        )}

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.checked)}
          />
          OVA activo (puede asignarse a estudiantes)
        </label>

        {error && <p className="text-sm text-coral">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
