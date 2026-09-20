# React + TypeScript + Vite

## Configuracion del entorno

El Panel selecciona dinamicamente su API. `VITE_API_URL`, cuando se
proporciona, tiene prioridad sobre `VITE_API_ENV`. Sin variables usa el backend
local.

| Entorno | URL |
|---|---|
| `local` | `http://localhost:3000` |
| `test` | `https://api-test.restapp.site` |
| `production` | `https://api.restapp.site` |
| `university` | `http://179.197.239.216:3000` |

## Ejecutar localmente

Backend local, que es el comportamiento predeterminado:

```bash
npm run dev
```

APIs remotas:

```bash
npm run dev:test
npm run dev:production
npm run dev:university
```

Abre `http://localhost:5173`. Para generar los builds:

```bash
npm run build
npm run build:test
npm run build:production
npm run build:university
```

## Ejecutar en contenedor

El contenedor publica el Panel en `http://localhost:8080`. En PowerShell:

```powershell
# Local (predeterminado)
docker compose -p rest-panel up -d --build --force-recreate

# Pruebas
$env:VITE_API_ENV = "test"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate

# Produccion
$env:VITE_API_ENV = "production"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate

# Universidad
$env:VITE_API_ENV = "university"
$env:VITE_API_URL = ""
docker compose -p rest-panel up -d --build --force-recreate

Remove-Item Env:VITE_API_ENV -ErrorAction SilentlyContinue
Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
```

Para desarrollo con el codigo montado como volumen:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Abre `http://localhost:5173`. Vite detecta cambios de archivos y cambios de
rama sin ejecutar `docker build`.

Si una rama cambia `package.json` o `package-lock.json`, reinicia el servicio para volver a ejecutar `npm ci`:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml restart admin
```

Detener desarrollo:

```powershell
docker compose -p rest-panel-dev -f docker-compose.dev.yml down
```

`VITE_API_ENV` admite `local`, `test`, `production` y `university`.
`VITE_API_URL` es opcional y siempre tiene prioridad. Las URLs publicas de una
API son visibles en el navegador y no deben considerarse secretos.

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
