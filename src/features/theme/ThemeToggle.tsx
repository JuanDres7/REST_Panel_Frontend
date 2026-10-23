import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useThemeStore, type ThemeMode } from './themeStore';

const OPCIONES: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'light', label: 'Tema claro', icon: Sun },
  { mode: 'system', label: 'Tema del sistema', icon: Monitor },
  { mode: 'dark', label: 'Tema oscuro', icon: Moon },
];

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <div
      role="radiogroup"
      aria-label="Tema de la interfaz"
      className="flex items-center gap-1 rounded-xl bg-surface-secondary p-1"
    >
      {OPCIONES.map(({ mode: valor, label, icon: Icon }) => {
        const activo = mode === valor;
        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={activo}
            aria-label={label}
            title={label}
            onClick={() => setMode(valor)}
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg py-1.5 transition-all duration-200 ${
              activo
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
