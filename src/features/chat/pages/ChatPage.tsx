import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, WifiOff, Loader2, ShieldOff } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useChatSocket } from '../../../hooks/useChatSocket';
import { chatApi, pacientesApi } from '../../../api';
import { Card } from '../../../components/ui';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import type { Mensaje, SocketMessage, PerfilEstudiante } from '../../../types';

const TYPING_TIMEOUT_MS = 2500;

export default function ChatPage() {
  const { estudianteId: estudianteIdParam } = useParams<{ estudianteId: string }>();
  const navigate = useNavigate();
  const estudianteId = Number(estudianteIdParam);
  const { token, user } = useAuth();

  const [chatId, setChatId] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [estudiante, setEstudiante] = useState<PerfilEstudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ownTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status, sendMessage, onNewMessage, onTyping, sendTyping } = useChatSocket(chatId, token || '');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudianteId]);

  useEffect(() => {
    const unsubscribe = onNewMessage((msg: SocketMessage) => {
      setMensajes((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            chat_id: msg.chatId,
            usuario_id: msg.userId,
            mensaje: msg.mensaje,
            enviado_en: msg.enviado_en,
          },
        ];
      });
      if (msg.userId !== user?.id) setOtherIsTyping(false);
    });
    return unsubscribe;
  }, [onNewMessage, user?.id]);

  useEffect(() => {
    const unsubscribe = onTyping((payload) => {
      if (payload.userId === user?.id) return;
      setOtherIsTyping(payload.isTyping);
      if (typingClearTimer.current) clearTimeout(typingClearTimer.current);
      if (payload.isTyping) {
        typingClearTimer.current = setTimeout(() => setOtherIsTyping(false), TYPING_TIMEOUT_MS);
      }
    });
    return unsubscribe;
  }, [onTyping, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const mensajesOrdenados = useMemo(
    () => [...mensajes].sort((a, b) => new Date(a.enviado_en).getTime() - new Date(b.enviado_en).getTime()),
    [mensajes]
  );

  async function loadData() {
    if (!Number.isFinite(estudianteId)) {
      setError('No se especificó un estudiante válido.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const chat = await chatApi.abrirChat(estudianteId);
      setChatId(chat.id);

      const [mensajesData, estudianteData] = await Promise.all([
        chatApi.getMensajes(chat.id),
        pacientesApi.getPerfil(estudianteId).catch(() => null),
      ]);
      setMensajes(mensajesData);
      setEstudiante(estudianteData);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) {
        setForbidden(true);
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Error al cargar el chat';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = nuevoMensaje.trim();
    if (!texto) return;
    const sent = sendMessage(texto);
    if (sent) {
      setNuevoMensaje('');
      sendTyping(false);
    }
  }

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setNuevoMensaje(e.target.value);
    sendTyping(e.target.value.length > 0);

    if (ownTypingTimer.current) clearTimeout(ownTypingTimer.current);
    ownTypingTimer.current = setTimeout(() => sendTyping(false), TYPING_TIMEOUT_MS);
  }

  if (loading) return <LoadingSpinner />;

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
        <ShieldOff className="h-12 w-12 text-coral mb-4" />
        <p className="text-text-primary font-medium mb-1">No tienes acceso a este estudiante</p>
        <p className="text-text-secondary text-sm mb-4">
          Solo puedes chatear con estudiantes que tengas asignados y aprobados.
        </p>
        <button onClick={() => navigate('/pacientes')} className="text-primary text-sm font-medium hover:underline cursor-pointer">
          Volver a mis pacientes
        </button>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const isConnected = status === 'connected';
  const nombreEstudiante = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'estudiante';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-4">
        <ArrowLeft size={24} className="text-text-secondary cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary">Chat con {nombreEstudiante}</h2>
          <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
            {status === 'connecting' && (
              <>
                <Loader2 size={12} className="animate-spin" /> Conectando...
              </>
            )}
            {status === 'connected' && (
              <>
                <span className="h-2 w-2 rounded-full bg-semaforo-verde inline-block" /> En línea
              </>
            )}
            {(status === 'disconnected' || status === 'error') && (
              <>
                <WifiOff size={12} /> Desconectado — intentando reconectar
              </>
            )}
          </p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden" padding="sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mensajesOrdenados.length === 0 && (
            <p className="text-center text-sm text-text-muted mt-8">
              Aún no hay mensajes. Escribe el primero para iniciar la conversación.
            </p>
          )}
          {mensajesOrdenados.map((msg) => {
            const isOwn = msg.usuario_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2 ${
                    isOwn ? 'bg-primary text-white' : 'bg-surface-elevated text-text-primary'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.mensaje}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-text-muted'}`}>
                    {new Date(msg.enviado_en).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          {otherIsTyping && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 bg-surface-elevated text-text-muted text-sm italic">
                {nombreEstudiante} está escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleEnviar} className="flex items-center gap-2 p-3 border-t border-gray-100">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={handleTyping}
            disabled={!isConnected}
            placeholder={isConnected ? 'Escribe un mensaje...' : 'Reconectando...'}
            className="flex-1 rounded-lg border border-gray-200 bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!nuevoMensaje.trim() || !isConnected}
            className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>
      </Card>
    </div>
  );
}