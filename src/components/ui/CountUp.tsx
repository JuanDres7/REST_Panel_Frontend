import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CountUpProps {
  value: number;
  className?: string;
}

/** Numero que cuenta hasta `value`. Con "reducir movimiento" muestra el valor final directo. */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      el.textContent = String(value);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const contador = { valor: 0 };
        gsap.to(contador, {
          valor: value,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(contador.valor));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] },
  );

  // Sin hijos: el texto lo escribe el efecto (antes de pintar), asi React no compite con GSAP.
  return <span ref={ref} className={className} aria-label={String(value)} />;
}
