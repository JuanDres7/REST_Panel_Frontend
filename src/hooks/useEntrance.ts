import { useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const MOVIMIENTO_NORMAL = '(prefers-reduced-motion: no-preference)';

interface EntranceOptions {
  /** Selector (dentro del scope) de los elementos que entran. */
  selector?: string;
  /** La animacion corre cuando esto pasa a true (por ejemplo, cuando ya cargaron los datos). */
  ready?: boolean;
  /** Maximo de elementos animados: en listas largas solo entran los primeros. */
  limit?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** Cuando cambia, el efecto vuelve a correr y entran los elementos nuevos (por ejemplo, al cambiar de pestana). */
  trigger?: unknown;
}

/**
 * Entrada escalonada (fade + subida corta) de los elementos marcados con `data-enter`.
 * - Un solo tween con stagger de duracion total fija, asi una lista larga no se retrasa.
 * - Solo `transform` y `autoAlpha`; al terminar se limpian los estilos inline.
 * - Con "reducir movimiento" no se crea ninguna animacion y el contenido aparece directo.
 * - useGSAP revierte todo al desmontar (necesario con StrictMode).
 */
export function useEntrance(
  scope: RefObject<HTMLElement | null>,
  { selector = '[data-enter]', ready = true, limit = 12, y = 12, trigger }: EntranceOptions = {},
) {
  useGSAP(
    () => {
      if (!ready || !scope.current) return;

      const mm = gsap.matchMedia();
      mm.add(MOVIMIENTO_NORMAL, () => {
        // `data-entered` se marca al terminar: si la pagina vuelve a disparar el efecto (por ejemplo,
        // al recargar una lista), solo entran los elementos nuevos. Si el efecto se revierte antes de
        // terminar (StrictMode en desarrollo), el marcador no queda y la animacion se repite bien.
        const items = gsap
          .utils.toArray<HTMLElement>(`${selector}:not([data-entered])`, scope.current)
          .slice(0, limit);
        if (items.length === 0) return;

        gsap.from(items, {
          y,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.out',
          stagger: { amount: 0.35 },
          clearProps: 'transform,opacity,visibility',
          onComplete: () => items.forEach((el) => el.setAttribute('data-entered', '')),
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies: [ready, selector, limit, y, trigger] },
  );
}

/** Ref + hook en uno, para componentes que solo necesitan el contenedor. */
export function useEntranceRef<T extends HTMLElement = HTMLDivElement>(options?: EntranceOptions) {
  const ref = useRef<T>(null);
  useEntrance(ref, options);
  return ref;
}
