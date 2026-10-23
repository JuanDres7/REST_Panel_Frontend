# Modulo OVA en el panel del psicologo

Los OVAs (objetos virtuales de aprendizaje) se gestionan desde el panel contra `/api/psicologo/ovas` (rol `psicologo`).

## Pantallas
| Ruta | Archivo | Funcion |
|---|---|---|
| `/ovas` | `features/ovas/pages/OvasPage.tsx` | Catalogo: buscar, filtrar, crear, editar, activar/desactivar, eliminar |
| `/ovas/:id` | `features/ovas/pages/OvaDetailPage.tsx` | Vista previa del recurso, reglas de asignacion y efectividad del OVA |
| `/ovas/efectividad` | `features/ovas/pages/OvaEfectividadPage.tsx` | Efectividad global |
| `/pacientes/:id` (pestana OVAs) | `features/pacientes/components/OvasPaciente.tsx` | OVAs asignados al estudiante |

Servicio: `src/api/ova.api.ts`. Tipos: `src/types/ova.types.ts`.

## Endpoints
- `GET|POST /api/psicologo/ovas`, `GET|PATCH|DELETE /api/psicologo/ovas/:id`, `PATCH /:id/estado`
- `POST /api/psicologo/ovas/archivos` (multipart, campo `archivo`, max. 80 MB; mp4, webm, mov, mp3, m4a, pdf, jpg, png, webp)
- `GET|POST /:id/reglas`, `PATCH|DELETE /reglas/:reglaId`
- `GET /efectividad`, `GET /:id/efectividad`
- `GET /api/psicologo/ovas/pacientes/:estudianteId/ovas` (requiere asignacion `APROBADO`, si no responde 403).
  El Swagger del backend documenta esta ruta como `/api/psicologo/pacientes/{id}/ovas`, lo cual es incorrecto.

## Reglas de negocio relevantes
- Fuentes: `YOUTUBE`, `CLOUDFLARE_R2`, `EXTERNAL_URL`. Con R2 la subida es en dos pasos: el panel sube el archivo y usa la `key` devuelta (`ovas/<uuid>.<ext>`) como `resource_url`.
  Si se cancela despues de subir, el archivo queda huerfano en R2.
- Una regla necesita `dimension` y/o `nivel`. Solo dimension: coincide si esa dimension esta en amarillo o rojo. Solo nivel: coincide con el semaforo global. Duplicada: 409.
- Maximo 3 OVAs por evaluacion. Cooldown: 14 dias tras completar, 7 tras omitir o descartar.
- Efectividad: `delta = post - pre`; **negativo = mejoria**.
- Si el servidor no tiene R2 configurado, la subida responde 503.
