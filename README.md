# REST Panel Frontend

Panel web construido con React, TypeScript y Vite.

## 1) Requisitos e instalacion

- Node.js 24
- npm
- Docker y Docker Compose para ejecución contenerizada

```bash
npm install
```

## 2) Configuracion de API

El Panel no contiene URLs de API en el código. Lee exclusivamente
`VITE_API_URL` desde un único `.env` privado.

| Entorno | `VITE_API_URL` |
|---|---|
| Local | `http://localhost:3000` |
| Pruebas | `https://api-test.restapp.site` |
| Producción | `https://api.restapp.site` |
| Universidad | `http://179.197.239.216:3000` |

Crea el archivo inicial:

```powershell
Copy-Item .env.example .env
```

`.env` está ignorado por Git. Para cambiar de entorno, reemplaza únicamente su
contenido.

### Local

```powershell
'VITE_API_URL=http://localhost:3000' | Out-File .env -Encoding ascii
```

### Pruebas

```powershell
'VITE_API_URL=https://api-test.restapp.site' | Out-File .env -Encoding ascii
```

### Produccion

```powershell
'VITE_API_URL=https://api.restapp.site' | Out-File .env -Encoding ascii
```

### Universidad

```powershell
'VITE_API_URL=http://179.197.239.216:3000' | Out-File .env -Encoding ascii
```

## 3) Ejecutar desde la terminal

La URL puede enviarse en el mismo comando, sin modificar `.env`:

```powershell
# Local
$env:VITE_API_URL='http://localhost:3000'; npm run dev

# Pruebas
$env:VITE_API_URL='https://api-test.restapp.site'; npm run dev

# Producción
$env:VITE_API_URL='https://api.restapp.site'; npm run dev
```

También puedes utilizar la URL guardada en `.env`:

```bash
npm run dev
```

El Panel queda disponible en `http://localhost:5173`.

## 4) Construir el Panel

```powershell
# Local
$env:VITE_API_URL='http://localhost:3000'; npm run build

# Pruebas
$env:VITE_API_URL='https://api-test.restapp.site'; npm run build

# Producción
$env:VITE_API_URL='https://api.restapp.site'; npm run build
```

Para construir utilizando el `.env` actual:

```bash
npm run build
```

Los archivos generados quedan en `dist/`. Para probarlos:

```bash
npm run preview
```

## 5) Ejecutar con Docker

El contenedor usa el mismo `.env` y publica el Panel en
`http://localhost:8080`:

```powershell
docker compose --env-file .env -p rest-panel up -d --build --force-recreate
```

Ver logs y detenerlo:

```powershell
docker compose --env-file .env -p rest-panel logs -f admin
docker compose --env-file .env -p rest-panel down
```

## 6) Desarrollo con Docker y volumen

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Vite queda disponible en `http://localhost:5173` y detecta los cambios del
código. Si cambian las dependencias:

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml restart admin
```

Para detenerlo:

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml down
```

## 7) Seguridad

Solo `.env.example` se guarda en Git. El `.env` real está ignorado. No guardes
contraseñas, tokens ni llaves privadas en variables que comiencen por `VITE_`,
porque Vite las incorpora al frontend compilado. La URL pública de la API será
visible en el navegador por diseño.
