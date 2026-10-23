import { useAuth } from '../../../hooks/useAuth';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui';
import { useEntranceRef } from '../../../hooks/useEntrance';

export default function PerfilPage() {
  const { user } = useAuth();
  const ref = useEntranceRef<HTMLDivElement>();

  return (
    <div ref={ref}>
      <Header title="Mi perfil" subtitle="Informacion de tu cuenta" />

      <Card data-enter>
        <dl className="divide-y divide-line text-sm">
          <div className="flex justify-between py-3 first:pt-0">
            <dt className="text-text-secondary">Nombre completo:</dt>
            <dd className="font-medium text-text-primary">{user?.nombres} {user?.apellidos}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-text-secondary">Correo:</dt>
            <dd className="font-medium text-text-primary">{user?.correo}</dd>
          </div>
          <div className="flex justify-between py-3 last:pb-0">
            <dt className="text-text-secondary">Rol:</dt>
            <dd className="font-medium capitalize text-text-primary">{user?.rol}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
