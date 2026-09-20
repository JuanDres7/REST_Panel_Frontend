# React + TypeScript + Vite

## Configuracion del entorno

El Panel utiliza exclusivamente `VITE_API_URL` desde un unico archivo `.env`.
El archivo real no se versiona y la aplicacion falla al iniciar o compilar si
la variable no existe. Crealo a partir de la plantilla:

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Configura el mismo `.env` según la API que quieras consumir.

### Backend local

```dotenv
VITE_API_URL=http://localhost:3000
```

### API de pruebas

```dotenv
VITE_API_URL=https://api-test.restapp.site
```

### API de produccion

```dotenv
VITE_API_URL=https://api.restapp.site
```

Solo `.env.example` se guarda en Git. La URL publica de una API siempre sera
visible en el navegador y no debe considerarse un secreto.

## Ejecutar localmente

El comando es el mismo para cualquiera de las tres APIs; la seleccion depende
del valor presente en `.env`:

```bash
npm run dev
```

Abre `http://localhost:5173`. Para generar el build:

```bash
npm run build
```

## Ejecutar en contenedor

El contenedor utiliza el mismo `.env` y publica el Panel en
`http://localhost:8080`:

```powershell
docker compose --env-file .env -p rest-panel up -d --build
```

Para desarrollo con el codigo montado como volumen:

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml up -d
```

Abre `http://localhost:5173`. Vite detecta cambios de archivos y cambios de
rama sin ejecutar `docker build`.

Si una rama cambia `package.json` o `package-lock.json`, reinicia el servicio para volver a ejecutar `npm ci`:

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml restart admin
```

Detener desarrollo:

```powershell
docker compose --env-file .env -p rest-panel-dev -f docker-compose.dev.yml down
```

`VITE_API_URL` es obligatoria tanto para el build normal como para Docker.

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
