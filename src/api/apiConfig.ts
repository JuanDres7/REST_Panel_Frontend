const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const configuredEnvironment = (
  import.meta.env.VITE_API_ENV?.trim() || import.meta.env.MODE || 'local'
).toLowerCase();

const environmentUrls: Record<string, string> = {
  local: 'http://localhost:3000',
  development: 'http://localhost:3000',
  test: 'https://api-test.restapp.site',
  production: 'https://api.restapp.site',
  university: 'http://179.197.239.216:3000',
};

const selectedApiUrl = configuredApiUrl || environmentUrls[configuredEnvironment];

if (!selectedApiUrl) {
  throw new Error(
    'VITE_API_ENV must be local, test, production or university',
  );
}

export const API_URL = selectedApiUrl.replace(/\/+$/, '');
