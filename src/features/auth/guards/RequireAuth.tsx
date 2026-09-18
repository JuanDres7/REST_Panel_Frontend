import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'psicologo') {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <>{children}</>;
}
