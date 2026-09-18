import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export function ForbiddenPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary p-4">
      <div className="text-center max-w-md">
        <ShieldOff className="h-16 w-16 text-coral mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Acceso denegado</h1>
        <p className="text-text-secondary mb-6">
          No tienes permiso para acceder a este recurso. Si crees que esto es un error, contacta al administrador.
        </p>
        <div className="flex flex-col gap-3">
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
