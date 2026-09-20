# React + TypeScript + Vite

## Entornos de API

El Panel utiliza exclusivamente `VITE_API_URL`. Vite carga el archivo del modo
seleccionado y falla al iniciar o compilar si la variable no existe.

```bash
# Backend local (predeterminado)
npm run dev

# Backend de pruebas
npm run dev:test

# Backend de produccion
npm run dev:production

# Build local
npm run build:local

# Build de pruebas
npm run build:test

# Build de produccion
npm run build
```

| Entorno | API |
|---|---|
| `local` | `http://localhost:3000` |
| `test` | `https://api-test.restapp.site` |
| `production` | `https://api.restapp.site` |

Los modos corresponden a estos archivos:

- `npm run dev` / `npm run dev:local`: `.env.development`
- `npm run dev:test`: `.env.test`
- `npm run dev:production`: `.env.production`

Una URL distinta puede inyectarse explícitamente en `VITE_API_URL` sin cambiar
el codigo. La URL publica de una API siempre sera visible en el navegador y no
debe considerarse un secreto.

## Contenedor local

El mismo frontend local puede conectarse a cualquiera de los tres entornos. El
contenedor publica el Panel en `http://localhost:8080`:

```powershell
# Backend local
docker compose --env-file .env.development -p rest-panel-local up -d --build

# Backend de pruebas
docker compose --env-file .env.test -p rest-panel-test up -d --build

# Backend de produccion
docker compose --env-file .env.production -p rest-panel-production up -d --build
```

`APP_ENV` y `VITE_API_URL` son obligatorias para Docker.

## Desarrollo de ramas test con volumen

Para desarrollo local con el codigo montado como volumen:

```powershell
docker compose --env-file .env.development -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Abre `http://localhost:5173`. Vite detecta cambios de archivos y cambios de rama sin ejecutar `docker build`.

Si una rama cambia `package.json` o `package-lock.json`, reinicia el servicio para volver a ejecutar `npm ci`:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml restart admin
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
