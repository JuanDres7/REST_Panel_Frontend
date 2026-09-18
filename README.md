# React + TypeScript + Vite

## Entornos de API

El Panel utiliza `VITE_API_URL` como unica fuente para Axios y Socket.IO.

```bash
# Panel local conectado al entorno de pruebas del VPS
npm run dev

# Equivalente explicito
npm run dev:test

# Panel local conectado a produccion
npm run dev:production

# Build de pruebas
npm run build:test

# Build de produccion
npm run build
```

| Entorno | API |
|---|---|
| `test` | `https://api-test.restapp.site` |
| `production` | `https://api.restapp.site` |

`localhost` no es un tercer entorno. Si tambien se ejecuta el backend en el equipo local, crea `.env.test.local` (no versionado); Vite lo usara como sobrescritura personal del entorno `test`:

```dotenv
VITE_API_URL=http://localhost:3000
```

## Contenedor local

Por defecto el contenedor consume el entorno `test` y publica el Panel en `http://localhost:8080`:

```bash
docker compose up -d --build
```

`APP_ENV` y `VITE_API_URL` pueden sobrescribirse al construir. Una URL local es solamente una opcion de desarrollo, no un tercer entorno.

## Desarrollo de ramas test con volumen

Para `develop` y `feature/*`, usa Vite dentro de Docker con el codigo montado como volumen y la API fija de pruebas:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Abre `http://localhost:5173`. Vite detecta cambios de archivos y cambios de rama sin ejecutar `docker build`.

Si una rama cambia `package.json` o `package-lock.json`, reinicia el servicio para volver a ejecutar `npm ci`:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml restart admin
```

Para validar `main` contra produccion, construye la imagen release:

```powershell
$env:APP_ENV = "production"
$env:VITE_API_URL = "https://api.restapp.site"
docker compose -p rest-panel-release up -d --build
Remove-Item Env:APP_ENV
Remove-Item Env:VITE_API_URL
```

Detener desarrollo:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml down
```

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
