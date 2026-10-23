import { NavLink } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Library, LogOut, Mail, Users, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const secciones: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: 'General',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/solicitudes', icon: Mail, label: 'Solicitudes' },
      { to: '/pacientes', icon: Users, label: 'Pacientes' },
    ],
  },
  {
    titulo: 'Herramientas',
    items: [{ to: '/ovas', icon: Library, label: 'OVAs' }],
  },
];

interface SidebarProps {
  /** En pantallas pequeñas el sidebar es un drawer; en lg siempre esta visible. */
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { logout, fullName } = useAuth();
  const inicial = fullName.trim().charAt(0).toUpperCase() || 'P';

  return (
    <aside
      className={`fixed bottom-4 left-4 top-4 z-50 flex w-64 flex-col rounded-3xl border border-line bg-surface shadow-card transition-transform duration-300 ease-out lg:z-30 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-[120%]'
      }`}
    >
      <div className="flex items-center gap-3 px-6 pb-4 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-md shadow-primary/25">
          <HeartPulse size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-text-primary">REST</h1>
          <p className="text-xs text-text-muted">Panel del psicologo</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-2">
        {secciones.map((seccion) => (
          <div key={seccion.titulo}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {seccion.titulo}
            </p>
            <div className="space-y-1">
              {seccion.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-md shadow-primary/25'
                        : 'text-text-secondary hover:translate-x-0.5 hover:bg-surface-elevated hover:text-text-primary'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-line p-4">
        <ThemeToggle />
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            {inicial}
          </div>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{fullName}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-coral-light hover:text-coral"
        >
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
