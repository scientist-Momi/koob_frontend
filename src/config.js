// Environment-aware API configuration. Vite exposes env variables via import.meta.env.
// Create a `.env` / `.env.development` / `.env.production` and set VITE_API_BASE_URL, VITE_API_BASE as needed.
// Example (.env.development): VITE_API_BASE_URL=http://localhost:8080/api/v1
// Example (.env.production): VITE_API_BASE_URL=https://api.koob.oolumomi.dev/api/v1

export const API_BASE_URL_LOCAL =
  import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8080/api/v1'
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.koob.oolumomi.dev/api/v1'
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.koob.oolumomi.dev'

// Backwards-compat comment
// http://localhost:8080/login/oauth2/code/google
