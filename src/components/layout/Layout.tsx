import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeartPulse, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Layout() {
  const { pathname } = useLocation();
  // El drawer recuerda en que ruta se abrio: al navegar deja de coincidir y se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const menuAbierto = abiertoEn === pathname;
  const setMenuAbierto = (abierto: boolean) => setAbiertoEn(abierto ? pathname : null);

  useEffect(() => {
    if (!menuAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbiertoEn(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAbierto]);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menu"
          className="cursor-pointer rounded-lg p-1.5 text-text-primary transition-colors hover:bg-surface-elevated"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 font-bold text-text-primary">
          <HeartPulse size={20} className="text-primary" />
          REST
        </div>
      </div>

      {menuAbierto && (
        <div
          className="fixed inset-0 z-40 bg-(--overlay) backdrop-blur-sm lg:hidden"
          onClick={() => setMenuAbierto(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar open={menuAbierto} onNavigate={() => setMenuAbierto(false)} />

      <main className="p-4 sm:p-6 lg:ml-72 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
