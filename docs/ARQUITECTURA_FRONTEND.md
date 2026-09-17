# Arquitectura Frontend — Panel del Psicólogo

> Documento de referencia para el equipo de frontend del panel web del psicólogo.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + Vite |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS (paleta terapéutica) |
| HTTP | Axios (con interceptores JWT/403) |
| Tiempo real | Socket.io (chat) |
| Estado global | Zustand |
| Routing | React Router v6 |
| Iconos | Lucide React |

---

## Estructura de Carpetas

```
src/
├── api/                          # Cliente HTTP centralizado
│   ├── axiosInstance.ts          # Axios + interceptores JWT/401/403
│   ├── auth.api.ts               # Login
│   ├── asignaciones.api.ts       # Solicitudes (aprobar/rechazar)
│   ├── pacientes.api.ts          # Pacientes asignados + detalle
│   ├── chat.api.ts               # Chat REST
│   ├── socket.ts                 # Socket.io client
│   └── index.ts                  # Re-exports
│
├── components/
│   ├── ui/                       # Componentes atómicos reutilizables
│   │   ├── Button.tsx            # Variantes: primary, secondary, coral, ghost
│   │   ├── Input.tsx             # Con label y error
│   │   ├── Card.tsx              # Contenedor con sombra
│   │   ├── Badge.tsx             # Etiquetas de estado
│   │   ├── Modal.tsx             # Diálogo modal
│   │   └── index.ts
│   │
│   ├── layout/                   # Estructura de la app
│   │   ├── Sidebar.tsx           # Navegación lateral
│   │   ├── Header.tsx            # Título + acciones
│   │   ├── Layout.tsx            # Sidebar + Outlet
│   │   └── index.ts
│   │
│   └── shared/                   # Componentes de utilidad
│       ├── LoadingSpinner.tsx    # Indicador de carga
│       ├── ErrorState.tsx        # Mensaje de error + retry
│       ├── EmptyState.tsx        # Estado vacío
│       └── index.ts
│
├── features/                     # Módulos por funcionalidad
│   ├── auth/
│   │   ├── pages/LoginPage.tsx
│   │   ├── pages/ForbiddenPage.tsx
│   │   ├── store/authStore.ts
│   │   └── guards/RequireAuth.tsx
│   ├── dashboard/
│   │   └── pages/DashboardPage.tsx
│   ├── solicitudes/
│   │   └── pages/SolicitudesPage.tsx
│   ├── pacientes/
│   │   ├── pages/PacientesPage.tsx
│   │   └── pages/PacienteDetailPage.tsx
│   ├── chat/
│   │   └── pages/ChatPage.tsx
│   └── perfil/
│       └── pages/PerfilPage.tsx
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   └── useChatSocket.ts
│
├── types/                        # Interfaces TypeScript
│   ├── auth.types.ts
│   ├── psicologo.types.ts
│   ├── estudiante.types.ts
│   ├── asignacion.types.ts
│   ├── chat.types.ts
│   ├── evaluacion.types.ts
│   └── index.ts
│
├── App.tsx                       # Router principal
├── main.tsx                      # Entry point
└── index.css                     # Tailwind + paleta terapéutica
```

---

## Asignación por Persona

### Juan — Arquitectura, Auth e Integración ✅ COMPLETADO

**Responsabilidades:**
- Cliente API centralizado (Axios + JWT)
- Rutas protegidas por rol
- Guía de estilos y componentes base
- Manejo centralizado del 403
- Integración con Swagger del backend

**Carpetas asignadas:**
```
src/api/axiosInstance.ts
src/api/auth.api.ts
src/api/index.ts
src/components/ui/
src/components/layout/
src/components/shared/
src/features/auth/
src/hooks/
src/types/
src/App.tsx
src/index.css
.env.example
```

---

### Valery — Buzón del Psicólogo y Registro Emocional

**Responsabilidades:**
- Bandeja de solicitudes pendientes
- Acciones de aprobar/rechazar solicitudes
- Lista de pacientes activos con preview
- Vista de registro emocional del paciente
- Estadísticas agregadas del registro emocional

**Carpetas asignadas:**
```
src/features/solicitudes/pages/SolicitudesPage.tsx  ← COMPLETAR
src/features/pacientes/pages/PacientesPage.tsx      ← COMPLETAR
src/components/pacientes/RegistrosEmocional.tsx     ← CREAR
src/components/pacientes/EstadisticasChart.tsx      ← CREAR
```

**Endpoints a consumir:**
| Endpoint | Método | Uso |
|----------|--------|-----|
| `/api/asignaciones/psicologo/solicitudes` | GET | Buzón de solicitudes |
| `/api/asignaciones/:id/aprobar` | PATCH | Aprobar solicitud |
| `/api/asignaciones/:id/rechazar` | PATCH | Rechazar solicitud |
| `/api/asignaciones/psicologo/mis-pacientes` | GET | Lista de pacientes |
| `/api/psicologo/pacientes/:id/registro-emocional` | GET | Registros emocionales |
| `/api/psicologo/pacientes/:id/registro-emocional/estadisticas` | GET | Estadísticas |

---

### Alejandro — Panel de Consulta del Paciente

**Responsabilidades:**
- Ficha consolidada del estudiante
- Perfil del estudiante
- Historial de evaluaciones (puntaje, semáforo, observaciones)
- Actividades y encuestas respondidas
- Manejo explícito del 403 (estudiante no asignado)

**Carpetas asignadas:**
```
src/features/pacientes/pages/PacienteDetailPage.tsx  ← COMPLETAR
src/components/pacientes/PerfilEstudiante.tsx        ← CREAR
src/components/pacientes/HistorialEvaluaciones.tsx   ← CREAR
src/components/pacientes/ActividadesEstudiante.tsx   ← CREAR
src/components/pacientes/EncuestasEstudiante.tsx     ← CREAR
```

**Endpoints a consumir:**
| Endpoint | Método | Uso |
|----------|--------|-----|
| `/api/psicologo/pacientes/:id/resumen` | GET | Ficha consolidada |
| `/api/psicologo/pacientes/:id/perfil` | GET | Datos del estudiante |
| `/api/psicologo/pacientes/:id/evaluaciones` | GET | Evaluaciones |
| `/api/psicologo/pacientes/:id/actividades` | GET | Actividades |
| `/api/psicologo/pacientes/:id/encuestas` | GET | Encuestas |

**REGLAS DE PRIVACIDAD — NUNCA exponer:**
- Diario
- Feedback
- Fallas técnicas
- Solicitudes de premios

---

### Cinthia — Chat Profesional-Estudiante

**Responsabilidades:**
- Historial de chat entre psicólogo y estudiante
- Interfaz de envío de mensajes en tiempo real
- Apertura de chat activo (validado por asignación)

**Carpetas asignadas:**
```
src/features/chat/pages/ChatPage.tsx           ← COMPLETAR
src/components/chat/MessageBubble.tsx          ← CREAR
src/components/chat/ChatList.tsx               ← CREAR
```

**Endpoints y eventos a consumir:**
| Endpoint/Evento | Método | Uso |
|-----------------|--------|-----|
| `/api/chats` | GET | Lista de chats |
| `/api/chats` | POST | Crear chat |
| `/api/chats/:id` | GET | Obtener chat |
| `/api/chats/:id/mensajes` | GET | Mensajes del chat |
| `chat_message` | Socket | Enviar mensaje |
| `new_message` | Socket | Recibir mensaje |
| `typing` / `user_typing` | Socket | Indicador de escritura |

---

### Harlem — Flutter (App del Estudiante) ⚠️ NO TRABAJA EN ESTE REPO

**Responsabilidades (en Flutter):**
- Directorio de psicólogos con filtros
- Detalle del psicólogo
- Formulario de solicitud de atención
- Vista "Mis solicitudes"

---

### Góngora — Flutter (App del Estudiante) ⚠️ NO TRABAJA EN ESTE REPO

**Responsabilidades (en Flutter):**
- Flujo de encuesta inicial de onboarding
- Encuesta diaria adaptativa
- Visualización del semáforo por dimensiones

---

## Rutas de la Aplicación

| Ruta | Protegida | Componente | Responsable |
|------|-----------|------------|-------------|
| `/login` | No | LoginPage | Juan |
| `/acceso-denegado` | No | ForbiddenPage | Juan |
| `/` | Sí | DashboardPage | Juan |
| `/solicitudes` | Sí | SolicitudesPage | Valery |
| `/pacientes` | Sí | PacientesPage | Valery |
| `/pacientes/:id` | Sí | PacienteDetailPage | Alejandro |
| `/chat/:estudianteId` | Sí | ChatPage | Cinthia |
| `/perfil` | Sí | PerfilPage | Juan |

---

## Estados de Solicitud

```
pendiente ──→ aprobado ──→ finalizado
    │
    └──→ rechazado
```

**Indicadores visuales:**
- `pendiente` → Badge amarillo
- `aprobado` → Badge verde
- `rechazado` → Badge rojo
- `finalizado` → Badge gris

---

## Convenciones del Equipo

### Commits (Conventional Commits)
```
feat(modulo): descripción corta
fix(modulo): descripción corta
types(modulo): descripción corta
chore: descripción corta
```

**Ejemplos:**
- `feat(solicitudes): add approve/reject actions`
- `feat(chat): integrate Socket.io real-time messages`
- `feat(pacientes): add emotional records chart`
- `fix(auth): handle 403 on patient detail`

### Ramas
```
main          ← producción
  └── develop ← integración
       ├── feature/valery-buzon-solicitudes
       ├── feature/alejandro-panel-paciente
       └── feature/cinthia-chat-estudiante
```

### Merge
1. Crear rama desde `develop`
2. Hacer push y crear PR → `develop`
3. Revisar y merge
4. Cuando todo funcione: `develop` → `main`

---

## Endpoints del Backend (Referencia Rápida)

### Autenticación
| Endpoint | Método | Rol |
|----------|--------|-----|
| `/api/auth/login` | POST | Público |

### Asignaciones
| Endpoint | Método | Rol |
|----------|--------|-----|
| `/api/asignaciones/psicologo/solicitudes` | GET | psicologo |
| `/api/asignaciones/:id/aprobar` | PATCH | psicologo |
| `/api/asignaciones/:id/rechazar` | PATCH | psicologo |
| `/api/asignaciones/psicologo/mis-pacientes` | GET | psicologo |

### Panel del Paciente
| Endpoint | Método | Rol |
|----------|--------|-----|
| `/api/psicologo/pacientes/:id/resumen` | GET | psicologo |
| `/api/psicologo/pacientes/:id/perfil` | GET | psicologo |
| `/api/psicologo/pacientes/:id/evaluaciones` | GET | psicologo |
| `/api/psicologo/pacientes/:id/registro-emocional` | GET | psicologo |
| `/api/psicologo/pacientes/:id/registro-emocional/estadisticas` | GET | psicologo |
| `/api/psicologo/pacientes/:id/actividades` | GET | psicologo |
| `/api/psicologo/pacientes/:id/encuestas` | GET | psicologo |

### Chat
| Endpoint | Método | Rol |
|----------|--------|-----|
| `/api/chats` | GET | autenticado |
| `/api/chats` | POST | autenticado |
| `/api/chats/:id` | GET | autenticado |
| `/api/chats/:id/mensajes` | GET | autenticado |
| `/api/chats/:id/mensajes` | POST | autenticado |

### WebSocket (Socket.io)
| Evento | Dirección | Payload |
|--------|-----------|---------|
| `connection` | → server | `auth: { token }` |
| `chat_message` | → server | `{ chatId, mensaje }` |
| `new_message` | ← server | `{ id, chatId, userId, mensaje, enviado_en }` |
| `join_chat` | → server | `chatId` |
| `typing` | → server | `{ chatId, isTyping }` |
| `user_typing` | ← server | `{ chatId, userId, isTyping }` |
