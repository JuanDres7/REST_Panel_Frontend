# REST Panel Frontend

Panel web construido con React, TypeScript y Vite.

## 1) Requisitos e instalacion

- Node.js 24
- npm
- Docker y Docker Compose para ejecución contenerizada

```bash
npm install
```

## 2) Seleccion de API

El Panel selecciona dinamicamente la API. El orden de prioridad es:

1. `VITE_API_URL`, si se proporciona una URL explicita.
2. `VITE_API_ENV`, si se proporciona un entorno.
3. Modo de Vite (`test`, `production` o `university`).
4. `local` cuando no se proporciona nada.

| Entorno | URL |
|---|---|
| `local` | `http://localhost:3000` |
| `test` | `https://api-test.restapp.site` |
| `production` | `https://api.restapp.site` |
| `university` | `http://179.197.239.216:3000` |

## 3) Ejecutar desde la terminal

```bash
# Backend local (predeterminado)
npm run dev

# API de pruebas
npm run dev:test

# API de produccion
npm run dev:production

# API de la universidad
npm run dev:university
```

El Panel queda disponible en `http://localhost:5173`.

## 4) Construir el Panel

```bash
# Build conectado al backend local
npm run build

# Build conectado a pruebas
npm run build:test

# Build conectado a produccion
npm run build:production

# Build conectado a la universidad
npm run build:university
```

Los archivos generados quedan en `dist/`.

## 5) Ejecutar con Docker

El contenedor publica el Panel en `http://localhost:8080`. En PowerShell:

### Backend local

```powershell
$env:VITE_API_ENV = "local"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate
```

### API de pruebas

```powershell
$env:VITE_API_ENV = "test"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate
```

### API de produccion

```powershell
$env:VITE_API_ENV = "production"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate
```

### API de la universidad

```powershell
$env:VITE_API_ENV = "university"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate
```

Limpiar las variables de la terminal:

```powershell
Remove-Item Env:VITE_API_ENV -ErrorAction SilentlyContinue
Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
```

Ver logs y detener el contenedor:

```powershell
docker compose -p rest-panel logs -f admin
docker compose -p rest-panel down
```

## 6) Desarrollo con Docker y volumen

El codigo se monta como volumen y Vite detecta los cambios:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Para reiniciar después de cambiar dependencias:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml restart admin
```

Para detenerlo:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml down
```

## 7) URL personalizada

`VITE_API_URL` siempre tiene prioridad sobre el entorno seleccionado:

```powershell
$env:VITE_API_URL = "http://192.168.1.100:3000"
npm run dev
Remove-Item Env:VITE_API_URL
```

## 8) Seguridad

Las URLs de una API consumida por el navegador son publicas y no deben tratarse
como secretos. No guardes contraseñas, tokens ni llaves privadas en variables
que comiencen por `VITE_`, porque Vite las incorpora al frontend compilado.
