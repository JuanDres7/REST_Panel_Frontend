import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { authApi } from '../../../api';
import { useAuthStore } from '../store/authStore';
import { Button, Input, Card } from '../../../components/ui';
import { useEntranceRef } from '../../../hooks/useEntrance';

function getRolFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json?.role ?? null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const ref = useEntranceRef<HTMLDivElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(correo, contrasena);
      const user = (data as any).user ?? data;
      const token = (data as any).token;
      const rol = user?.rol ?? getRolFromToken(token);

      if (rol !== 'psicologo') {
        setError('Este panel es exclusivo para psicologos');
        return;
      }

      login(token, { ...user, rol });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-secondary p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 h-[28rem] w-[28rem] rounded-full bg-coral/10 blur-3xl"
      />

      <div ref={ref} className="relative w-full max-w-md">
        <div data-enter className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/30">
            <HeartPulse size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">REST Panel</h1>
          <p className="mt-1.5 text-sm text-text-secondary">Acceso para psicologos</p>
        </div>

        <Card data-enter padding="lg" className="shadow-float">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electronico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <Input
              label="Contrasena"
              type="password"
              placeholder="Tu contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-xl bg-coral-light px-3 py-2 text-sm text-coral">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
