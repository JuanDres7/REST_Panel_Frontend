import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useEntranceRef } from '../../../hooks/useEntrance';

export function ForbiddenPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const ref = useEntranceRef<HTMLDivElement>();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div ref={ref} className="max-w-md text-center">
        <div data-enter className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-coral-light">
          <ShieldOff className="h-12 w-12 text-coral" />
        </div>
        <h1 data-enter className="mb-2 text-3xl font-bold tracking-tight text-text-primary">Acceso denegado</h1>
        <p data-enter className="mb-6 text-text-secondary">
          No tienes permiso para acceder a este recurso. Si crees que esto es un error, contacta al administrador.
        </p>
        <div data-enter className="flex flex-col gap-3">
          <Button variant="coral" onClick={handleLogout}>
            Cerrar sesion
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
