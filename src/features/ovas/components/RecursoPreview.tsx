import { ExternalLink } from 'lucide-react';
import type { RecursoResuelto } from '../../../types';

interface RecursoPreviewProps {
  recurso?: RecursoResuelto;
}

const EXT_VIDEO = /\.(mp4|webm|mov)(\?|$)/i;
const EXT_AUDIO = /\.(mp3|m4a)(\?|$)/i;
const EXT_IMAGEN = /\.(jpe?g|png|webp)(\?|$)/i;

export function RecursoPreview({ recurso }: RecursoPreviewProps) {
  if (!recurso) return <p className="text-sm text-text-muted">Sin recurso disponible</p>;

  const url = recurso.resolved_url;

  if (recurso.storage_source === 'YOUTUBE' && recurso.embed_url) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={recurso.embed_url}
          title="Vista previa del OVA"
          className="h-full w-full"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (EXT_VIDEO.test(url)) {
    return <video src={url} controls className="w-full rounded-lg bg-black" />;
  }
  if (EXT_AUDIO.test(url)) {
    return <audio src={url} controls className="w-full" />;
  }
  if (EXT_IMAGEN.test(url)) {
    return <img src={url} alt="Vista previa del OVA" className="max-h-80 rounded-lg object-contain" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      <ExternalLink size={16} />
      Abrir recurso
    </a>
  );
}
