import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  ClipboardList,
  Activity,
  BarChart3,
  History,
  LayoutGrid,
  ShieldOff,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Badge, Button } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { pacientesApi } from '../../../api';
import type {
  ResumenEstudiante,
  EvaluacionHistorial,
  ActividadHistorial,
  EncuestaRespuestaHistorial,
} from '../../../types';
import { EvaluacionCard } from '../components/EvaluacionCard';
import { DimensionesSemaforo } from '../components/DimensionesSemaforo';
import { semaforoVariant } from '../components/nivelSemaforo';

type Tab = 'resumen' | 'evaluaciones' | 'actividades' | 'encuestas';

const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: 'resumen', label: 'Resumen', icon: LayoutGrid },
  { key: 'evaluaciones', label: 'Evaluaciones', icon: BarChart3 },
  { key: 'actividades', label: 'Actividades', icon: Activity },
  { key: 'encuestas', label: 'Encuestas', icon: ClipboardList },
];

function formatearRespuesta(respuesta: string): string {
  try {
    return JSON.stringify(JSON.parse(respuesta), null, 2);
  } catch {
    return respuesta;
  }
}

export default function PacienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const estudianteId = Number(id);

  const [tab, setTab] = useState<Tab>('resumen');
  const [resumen, setResumen] = useState<ResumenEstudiante | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionHistorial[] | null>(null);
  const [actividades, setActividades] = useState<ActividadHistorial[] | null>(null);
  const [encuestas, setEncuestas] = useState<EncuestaRespuestaHistorial[] | null>(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState('');
  const [accesoDenegado, setAccesoDenegado] = useState(false);

  useEffect(() => {
    loadResumen();
  }, [estudianteId]);

  function extraerMensaje(err: any): string {
    if (err?.response?.status === 403) {
      setAccesoDenegado(true);
      return 'No tienes acceso a este estudiante. Solo puedes consultar estudiantes con una asignacion aprobada.';
    }
    return err?.response?.data?.message || 'Error al cargar datos del paciente';
  }

  async function loadResumen() {
    setLoadingResumen(true);
    setError('');
    setAccesoDenegado(false);
    try {
      const data = await pacientesApi.getResumen(estudianteId);
      setResumen(data);
    } catch (err: any) {
      setError(extraerMensaje(err));
    } finally {
      setLoadingResumen(false);
    }
  }

  async function cargarEvaluaciones() {
    if (evaluaciones !== null) return;
    setTabLoading(true);
    setError('');
    try {
      setEvaluaciones(await pacientesApi.getEvaluaciones(estudianteId));
    } catch (err: any) {
      setError(extraerMensaje(err));
    } finally {
      setTabLoading(false);
    }
  }

  async function cargarActividades() {
    if (actividades !== null) return;
    setTabLoading(true);
    setError('');
    try {
      setActividades(await pacientesApi.getActividades(estudianteId));
    } catch (err: any) {
      setError(extraerMensaje(err));
    } finally {
      setTabLoading(false);
    }
  }

  async function cargarEncuestas() {
    if (encuestas !== null) return;
    setTabLoading(true);
    setError('');
    try {
      setEncuestas(await pacientesApi.getEncuestas(estudianteId));
    } catch (err: any) {
      setError(extraerMensaje(err));
    } finally {
      setTabLoading(false);
    }
  }

  function cambiarTab(next: Tab) {
    setTab(next);
    setError('');
    if (next === 'evaluaciones') cargarEvaluaciones();
    if (next === 'actividades') cargarActividades();
    if (next === 'encuestas') cargarEncuestas();
  }

  function handleAbrirChat() {
    navigate(`/chat/${estudianteId}`);
  }

  if (loadingResumen) return <LoadingSpinner />;

  if (accesoDenegado) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldOff size={48} className="text-coral mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Acceso denegado</h2>
        <p className="text-text-secondary max-w-md mb-6">{error}</p>
        <Button onClick={() => navigate('/pacientes')}>Volver a mis pacientes</Button>
      </div>
    );
  }

  if (error && !resumen) {
    return <ErrorState message={error} onRetry={loadResumen} />;
  }

  if (!resumen) {
    return <ErrorState message="Paciente no encontrado" />;
  }

  const resumenCargado = resumen;
  const perfil = resumenCargado.perfil;
  const ultimaEvaluacion = resumenCargado.ultima_evaluacion;

  function renderContenido() {
    if (tabLoading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={() => cambiarTab(tab)} />;

    if (tab === 'evaluaciones') {
      const items = evaluaciones ?? [];
      if (items.length === 0) {
        return (
          <EmptyState
            icon={<History size={48} />}
            title="Sin evaluaciones"
            description="El estudiante no tiene evaluaciones registradas."
          />
        );
      }
      return (
        <div>
          {items.map((e) => (
            <EvaluacionCard key={e.id} evaluacion={e} />
          ))}
        </div>
      );
    }

    if (tab === 'actividades') {
      const items = actividades ?? [];
      if (items.length === 0) {
        return (
          <EmptyState
            icon={<Activity size={48} />}
            title="Sin actividades"
            description="El estudiante no tiene actividades registradas."
          />
        );
      }
      return (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">
                  {a.opcion?.nombre ?? 'Actividad'}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Registrada: {new Date(a.fecha).toLocaleDateString('es-CO')} · Vence:{' '}
                  {new Date(a.vencimiento).toLocaleDateString('es-CO')}
                </p>
                {a.observaciones && (
                  <p className="text-sm text-text-secondary mt-2">{a.observaciones}</p>
                )}
              </div>
              {a.vencida ? (
                <Badge variant="gray">Vencida</Badge>
              ) : (
                <Badge variant="verde">Vigente</Badge>
              )}
            </Card>
          ))}
        </div>
      );
    }

    if (tab === 'encuestas') {
      const items = encuestas ?? [];
      if (items.length === 0) {
        return (
          <EmptyState
            icon={<ClipboardList size={48} />}
            title="Sin encuestas"
            description="El estudiante no ha respondido encuestas institucionales."
          />
        );
      }
      return (
        <div className="space-y-3">
          {items.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <p className="font-semibold text-text-primary">
                  {r.encuesta?.titulo ?? 'Encuesta'}
                </p>
                <span className="text-xs text-text-muted">
                  {new Date(r.fecha).toLocaleDateString('es-CO')}
                </span>
              </div>
              {r.encuesta && (
                <p className="text-xs text-text-muted mb-2">Codigo: {r.encuesta.codigo}</p>
              )}
              {r.respuesta ? (
                <pre className="text-sm text-text-secondary whitespace-pre-wrap bg-surface-secondary rounded-lg p-3">
                  {formatearRespuesta(r.respuesta)}
                </pre>
              ) : (
                <p className="text-sm text-text-muted">Sin respuesta registrada</p>
              )}
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Datos del estudiante</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Edad:</dt>
              <dd className="font-medium">{perfil.edad ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Sexo:</dt>
              <dd className="font-medium">{perfil.sexo ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Ciudad:</dt>
              <dd className="font-medium">{perfil.ciudad ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Semestre:</dt>
              <dd className="font-medium">{perfil.semestre_actual ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Nacimiento:</dt>
              <dd className="font-medium">
                {perfil.fecha_nacimiento
                  ? new Date(perfil.fecha_nacimiento).toLocaleDateString('es-CO')
                  : '-'}
              </dd>
            </div>
            {perfil.streak_goal_days > 0 && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">Compromiso de racha:</dt>
                <dd className="font-medium">
                  {perfil.streak_count} / {perfil.streak_goal_days} dias
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Ultima evaluacion</h3>
          {ultimaEvaluacion ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={semaforoVariant(ultimaEvaluacion.estado_semaforo)}>
                    {ultimaEvaluacion.estado_semaforo}
                  </Badge>
                  <span className="text-sm font-medium text-text-primary">
                    {ultimaEvaluacion.puntaje_total ?? '-'}
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  {new Date(ultimaEvaluacion.fecha).toLocaleDateString('es-CO')}
                </span>
              </div>
              {ultimaEvaluacion.subcategoria_principal && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subcategoria:</span>
                  <span className="font-medium">{ultimaEvaluacion.subcategoria_principal}</span>
                </div>
              )}
              {ultimaEvaluacion.observaciones && (
                <p className="text-sm text-text-secondary">{ultimaEvaluacion.observaciones}</p>
              )}
              <DimensionesSemaforo dimensiones={ultimaEvaluacion.dimensiones} />
            </div>
          ) : (
            <p className="text-sm text-text-muted">Sin evaluaciones registradas</p>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Actividades vigentes</h3>
          {resumenCargado.actividades_vigentes.length === 0 ? (
            <p className="text-sm text-text-muted">Sin actividades vigentes</p>
          ) : (
            <ul className="space-y-3">
              {resumenCargado.actividades_vigentes.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  {a.opcion?.url_imagen ? (
                    <img
                      src={a.opcion.url_imagen}
                      alt={a.opcion.nombre}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <CheckCircle2 size={28} className="text-semaforo-verde mt-1 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {a.opcion?.nombre ?? 'Actividad'}
                    </p>
                    <p className="text-xs text-text-muted">
                      Vence: {new Date(a.vencimiento).toLocaleDateString('es-CO')}
                    </p>
                    {a.observaciones && (
                      <p className="text-sm text-text-secondary">{a.observaciones}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Acciones rapidas</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 size={18} />
              Estadisticas emocionales
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity size={18} />
              Registro emocional
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/pacientes')}
          className="text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <Header
            title={`${perfil.nombres} ${perfil.apellidos}`}
            subtitle="Ficha de consulta del estudiante"
            actions={
              <Button onClick={handleAbrirChat}>
                <MessageCircle size={18} />
                Abrir chat
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => cambiarTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 text-sm font-medium cursor-pointer transition-colors ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {renderContenido()}
    </div>
  );
}