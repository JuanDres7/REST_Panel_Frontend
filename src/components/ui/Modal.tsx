import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // El modal se desmonta al cerrarse, asi que la animacion de entrada corre cada vez que se abre.
  useGSAP(
    () => {
      if (!isOpen || !rootRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-modal-overlay]', { autoAlpha: 0, duration: 0.2, ease: 'power1.out', clearProps: 'opacity,visibility' });
        gsap.from('[data-modal-panel]', {
          autoAlpha: 0,
          y: 16,
          scale: 0.97,
          duration: 0.28,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [isOpen] },
  );

  if (!isOpen) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div data-modal-overlay className="fixed inset-0 bg-(--overlay) backdrop-blur-sm" onClick={onClose} />
      <div
        data-modal-panel
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative mx-4 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-float"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="cursor-pointer rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
